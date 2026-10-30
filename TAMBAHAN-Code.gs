/**
 * TEMPEL fungsi ini di Code.gs (di bawah doGet). Fungsi lain TIDAK perlu diubah.
 * Setelah itu: Deploy > Manage deployments > Edit > Version: New version > Deploy.
 * (Akses web app tetap "Anyone".)
 */
function doPost(e) {
  let out;
  try {
    const body = JSON.parse(e.postData.contents);
    const R = {
      auth_login: auth_login, auth_register: auth_register,
      auth_requestReset: auth_requestReset, auth_confirmReset: auth_confirmReset,
      api_getData: api_getData, api_addIncome: api_addIncome, api_addExpense: api_addExpense,
      api_delete: api_delete, api_savePrice: api_savePrice,
      api_addProduct: api_addProduct, api_deleteProduct: api_deleteProduct
    };
    const f = R[body.fn];
    if (!f) throw new Error('Fungsi tidak dikenal.');
    out = { ok: true, data: f.apply(null, body.args || []) };
  } catch (err) {
    out = { ok: false, error: String((err && err.message) || err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
