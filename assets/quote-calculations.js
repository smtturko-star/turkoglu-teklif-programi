/*
 * Quote calculation helpers.
 *
 * The previous implementation calculated one global VAT rate for the whole
 * quote even though each quote item has its own vat_rate. These helpers keep
 * the item VAT rates authoritative and apply the quote-level VAT only to
 * labour, which is entered separately.
 */
(function () {
  'use strict';

  window.calculateQuoteTotals = function calculateQuoteTotals(items, labor, discount) {
    const safeItems = Array.isArray(items) ? items : [];
    const itemSubtotal = safeItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unit_price) || 0;
      return sum + quantity * unitPrice;
    }, 0);

    const itemVat = safeItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unit_price) || 0;
      const vatRate = Number(item.vat_rate) || 0;
      return sum + (quantity * unitPrice * vatRate) / 100;
    }, 0);

    const laborTotal = Math.max(0, Number(labor) || 0);
    const discountTotal = Math.max(0, Number(discount) || 0);
    const taxableLabor = Math.max(0, laborTotal - discountTotal);
    const taxableItems = Math.max(0, itemSubtotal - Math.min(discountTotal, itemSubtotal));

    // The existing UI stores one quote VAT rate for labour/remaining taxable
    // amount. Preserve that rate at call-site while preventing item VAT from
    // being double-counted.
    const subtotal = itemSubtotal + laborTotal;
    const netSubtotal = Math.max(0, subtotal - discountTotal);

    return {
      itemSubtotal,
      itemVat,
      laborTotal,
      discountTotal,
      taxableItems,
      taxableLabor,
      subtotal,
      netSubtotal,
      grandTotalBeforeLaborVat: netSubtotal + itemVat
    };
  };
})();
