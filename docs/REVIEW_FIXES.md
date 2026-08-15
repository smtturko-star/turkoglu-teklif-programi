# Review fixes

Branch: `agent/fix-quote-supabase-security`

## Included

### 1. Stock movement security
`supabase/migrations/20260808_fix_stock_security_and_rls.sql`:
- changes `record_stock_movement` from `SECURITY DEFINER` to `SECURITY INVOKER`
- removes anonymous execution
- keeps authenticated execution
- optimizes `stock_movements` RLS policies with `(select auth.uid())`
- removes the duplicate `company_settings_owner_unique` index, retaining the existing unique owner index

The migration is intentionally not applied to production from this branch.

### 2. Quote VAT calculation
`assets/quote-calculations.js` contains the corrected calculation primitive. The existing UI currently stores VAT per quote item but calculates the final VAT with one global `qvat` value. The final frontend integration should replace the calculation in `renderQuoteDraft()` and `saveQuote()` so that:

- each item's `quantity * unit_price * item.vat_rate / 100` contributes its own VAT;
- labour is calculated separately using the quote-level VAT rate;
- discount is applied once and never causes item VAT to be double-counted;
- the persisted `quotes.vat_total` and `quotes.grand_total` match the displayed total.

### 3. Auth hardening
Supabase's leaked-password protection is a project Auth setting rather than a normal application-table migration. Enable **Leaked Password Protection** in Supabase Auth password security before production release.

## Validation required before merge

1. Run the migration on a Supabase development branch.
2. Run Supabase security and performance advisors again.
3. Create a quote containing at least two items with different VAT rates (for example 20% and 10%) and verify the stored `vat_total` and `grand_total`.
4. Verify stock movement RPC calls still work for the authenticated owner and fail for another user's product.
5. Verify anonymous RPC execution is denied.
