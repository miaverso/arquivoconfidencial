/**
 * PHANTASMA // REGISTRO FINAL
 *
 * Cole este código em Extensões > Apps Script dentro da planilha.
 * Depois publique como Aplicativo da Web.
 *
 * IMPORTANTE:
 * Este script só registra dados brutos.
 * O critério secreto de premiação deve ser adicionado AQUI,
 * no backend, nunca no anuncio.html.
 */

const SHEET_NAME = "REGISTROS";

const HEADERS = [
  "received_at",
  "session_id",
  "completed_at",
  "name",
  "email",
  "social",
  "quiz_errors",
  "quiz_questions_seen",
  "panel_errors",
  "panel_revealed",
  "extra_clues",
  "shooting_penalty_seconds",
  "chosen_name",
  "chosen_id",
  "time_before_roulette",
  "roulette_bonus",
  "roulette_used",
  "shooting_initial_time",
  "shooting_attempts",
  "shooting_failures",
  "shooting_completed",
  "version"
];

function getSheet_(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if(!sheet){
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if(sheet.getLastRow() === 0){
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function doPost(e){
  try{
    const data = JSON.parse(e.postData.contents || "{}");
    const sheet = getSheet_();

    // Evita duplicar o mesmo ID de sessão.
    const ids = sheet.getLastRow() > 1
      ? sheet.getRange(2,2,sheet.getLastRow()-1,1).getValues().flat()
      : [];

    if(ids.includes(data.session_id)){
      return ContentService
        .createTextOutput(JSON.stringify({ok:true,duplicate:true}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const row = [
      new Date(),
      data.session_id || "",
      data.completed_at || "",
      data.name || "",
      data.email || "",
      data.social || "",
      data.quiz_errors || 0,
      data.quiz_questions_seen || 0,
      data.panel_errors || 0,
      data.panel_revealed || 0,
      data.extra_clues || 0,
      data.shooting_penalty_seconds || 0,
      data.chosen_name || "",
      data.chosen_id || "",
      data.time_before_roulette || 0,
      data.roulette_bonus || 0,
      data.roulette_used === true,
      data.shooting_initial_time || 0,
      data.shooting_attempts || 0,
      data.shooting_failures || 0,
      data.shooting_completed === true,
      data.version || ""
    ];

    sheet.appendRow(row);

    /*
      CRITÉRIO SECRETO DE PREMIAÇÃO:
      adicione posteriormente em colunas privadas ou em outra aba.
      NÃO retorne elegibilidade para o navegador.
    */

    return ContentService
      .createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);

  }catch(err){
    return ContentService
      .createTextOutput(JSON.stringify({ok:false,error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(){
  return ContentService
    .createTextOutput("PHANTASMA // ENDPOINT ATIVO")
    .setMimeType(ContentService.MimeType.TEXT);
}
