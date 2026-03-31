import { NextRequest, NextResponse } from 'next/server';

const ONTRAPORT_API_KEY = process.env.ONTRAPORT_API_KEY!;
const ONTRAPORT_APP_ID = process.env.ONTRAPORT_APP_ID!;

const OP_HEADERS = {
  'Api-Key': ONTRAPORT_API_KEY,
  'Api-Appid': ONTRAPORT_APP_ID,
  'Content-Type': 'application/json',
};

// Product ID used for Personal Trainer Course
const PT_PRODUCT_ID = 97;

export async function POST(req: NextRequest) {
  try {
    const { code, productId, packageId } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'Coupon code is required' }, { status: 400 });
    }

    const trimmedCode = code.trim().toUpperCase();
    console.log(`[Coupon] Validating code: "${trimmedCode}" for package: "${packageId}"`);

    // Package-specific coupon restrictions
    const CERT_ONLY_COUPONS = ['THECERT200'];
    const CAREER_ONLY_COUPONS = ['CAREER300', 'THECAREER300'];

    // Coupons that override the minimum deposit amount
    const COUPON_DEPOSIT_OVERRIDES: Record<string, number> = {
      THECERT200: 350,
    };
    if (packageId) {
      if (CAREER_ONLY_COUPONS.includes(trimmedCode) && packageId === 'pro-coach') {
        return NextResponse.json({ valid: false, error: 'Wrong coupon for this programme' });
      }
      if (CERT_ONLY_COUPONS.includes(trimmedCode) && packageId === 'complete-coach') {
        return NextResponse.json({ valid: false, error: 'Wrong coupon for this programme' });
      }
    }

    // Step 1: Search CouponCode objects (objectID=124) by code
    const searchParams = new URLSearchParams({
      objectID: '124',
      condition: JSON.stringify([
        { field: { field: 'code' }, op: '=', value: { value: trimmedCode } },
      ]),
    });

    const codeRes = await fetch(
      `https://api.ontraport.com/1/objects?${searchParams.toString()}`,
      { method: 'GET', headers: OP_HEADERS }
    );

    const codeResult = await codeRes.json();
    const codes = codeResult?.data || [];

    if (codes.length === 0) {
      console.log(`[Coupon] Code not found: "${trimmedCode}"`);
      return NextResponse.json({ valid: false, error: 'Invalid coupon code' });
    }

    const couponCodeObj = codes[0];
    const couponId = couponCodeObj.coupon_id;

    // Check code-level expiration (the individual code's expiry date)
    if (couponCodeObj.expiration && couponCodeObj.expiration !== '0') {
      const expiryDate = new Date(Number(couponCodeObj.expiration) * 1000);
      if (expiryDate < new Date()) {
        console.log(`[Coupon] Code expired: "${trimmedCode}" (expired ${expiryDate.toISOString()})`);
        return NextResponse.json({ valid: false, error: 'Coupon is expired' });
      }
    }

    // Step 2: Get parent Coupon (objectID=123) for discount details and status
    const couponRes = await fetch(
      `https://api.ontraport.com/1/object?objectID=123&id=${couponId}`,
      { method: 'GET', headers: OP_HEADERS }
    );

    const couponResult = await couponRes.json();
    const coupon = couponResult?.data;

    if (!coupon) {
      console.log(`[Coupon] Parent coupon not found for ID: ${couponId}`);
      return NextResponse.json({ valid: false, error: 'Invalid coupon' });
    }

    console.log(`[Coupon] Parent coupon: status="${coupon.status}", type="${coupon.type}", remaining="${coupon.remaining}", redeemed="${coupon.redeemed}"`);

    // Check parent coupon status — only reject if actually Expired or Reached Limit
    const status = String(coupon.status || '').toLowerCase();
    if (status === 'expired') {
      return NextResponse.json({ valid: false, error: 'Coupon is expired' });
    }
    if (status === 'reached limit' || status === 'reachedlimit') {
      return NextResponse.json({ valid: false, error: 'Coupon has reached its usage limit' });
    }
    if (status === 'not valid') {
      return NextResponse.json({ valid: false, error: 'Coupon is no longer valid' });
    }

    // Check remaining uses (for Group coupons with a set limit)
    const remaining = parseInt(coupon.remaining || '0', 10);
    const isGroupCoupon = String(coupon.type || '').toLowerCase() === 'group';

    if (isGroupCoupon && remaining <= 0) {
      console.log(`[Coupon] No remaining uses for group coupon: "${trimmedCode}"`);
      return NextResponse.json({ valid: false, error: 'Coupon has reached its usage limit' });
    }

    // For Personal coupons only: check if this specific code was already redeemed
    if (!isGroupCoupon && couponCodeObj.date_redeemed && couponCodeObj.date_redeemed !== '0') {
      console.log(`[Coupon] Personal code already redeemed: "${trimmedCode}"`);
      return NextResponse.json({ valid: false, error: 'This coupon has already been used' });
    }

    // Check coupon date validity (valid_start_date / valid_end_date on parent)
    if (coupon.valid_end_date && coupon.valid_end_date !== '0') {
      const endDate = new Date(Number(coupon.valid_end_date) * 1000);
      if (endDate < new Date()) {
        console.log(`[Coupon] Parent coupon date expired: "${trimmedCode}"`);
        return NextResponse.json({ valid: false, error: 'Coupon is expired' });
      }
    }
    if (coupon.valid_start_date && coupon.valid_start_date !== '0') {
      const startDate = new Date(Number(coupon.valid_start_date) * 1000);
      if (startDate > new Date()) {
        console.log(`[Coupon] Coupon not yet active: "${trimmedCode}" (starts ${startDate.toISOString()})`);
        return NextResponse.json({ valid: false, error: 'This coupon is not yet active' });
      }
    }

    // Step 3: Check if coupon applies to this product
    const productSelection = coupon.product_selection || '';
    if (productSelection && productSelection !== '0' && productSelection !== 'all') {
      const prodSearch = new URLSearchParams({
        objectID: '125',
        condition: JSON.stringify([
          { field: { field: 'coupon_id' }, op: '=', value: { value: String(couponId) } },
        ]),
      });

      const prodRes = await fetch(
        `https://api.ontraport.com/1/objects?${prodSearch.toString()}`,
        { method: 'GET', headers: OP_HEADERS }
      );

      const prodResult = await prodRes.json();
      const couponProducts = prodResult?.data || [];
      const targetProductId = productId || PT_PRODUCT_ID;
      const appliesToProduct = couponProducts.some(
        (cp: any) => String(cp.product_id) === String(targetProductId)
      );

      if (!appliesToProduct) {
        console.log(`[Coupon] Coupon ${couponId} doesn't apply to product ${targetProductId}`);
        return NextResponse.json({ valid: false, error: 'This coupon does not apply to this course' });
      }
    }

    // Step 4: Return discount details
    const discountType = (coupon.discount_type || '').toLowerCase();
    const discountValue = parseFloat(coupon.discount_value || '0');
    const couponName = coupon.name || trimmedCode;

    let type: 'flat' | 'percent';
    if (discountType.includes('percent') || discountType === '1') {
      type = 'percent';
    } else {
      type = 'flat';
    }

    const depositOverride = COUPON_DEPOSIT_OVERRIDES[trimmedCode];
    console.log(`[Coupon] Valid coupon: "${trimmedCode}" → ${type} discount of ${discountValue} (${couponName}), ${remaining} uses remaining${depositOverride !== undefined ? `, minDeposit override: €${depositOverride}` : ''}`);

    return NextResponse.json({
      valid: true,
      coupon: {
        id: couponId,
        code: trimmedCode,
        name: couponName,
        discountType: type,
        discountValue: discountValue,
        description: coupon.discount_description || '',
        ...(depositOverride !== undefined && { minDeposit: depositOverride }),
      },
    });
  } catch (err) {
    console.error('[Coupon] Validation error:', err);
    return NextResponse.json({ valid: false, error: 'Failed to validate coupon' }, { status: 500 });
  }
}
