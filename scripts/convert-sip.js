import fs from "fs";
import path from "path";

const inputPath = path.join(process.cwd(), "data", "CPdescarga.txt"); // cámbialo si tu archivo tiene otro nombre
const outputPath = path.join(process.cwd(), "data", "codigos.json");

function parseLine(line) {
  const parts = line.split("|"); // El TXT de SEPOMEX usa |
  return {
    d_codigo: parts[0],
    d_asenta: parts[1],
    d_tipo_asenta: parts[2],
    D_mnpio: parts[3],
    c_estado: parts[4],
    d_estado: parts[5],
    d_ciudad: parts[9] || "",
  };
}

function convert() {
  console.log("Leyendo archivo SIP…");

  const raw = fs.readFileSync(inputPath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim().length > 0);

  const records = lines.map(parseLine);

  fs.writeFileSync(outputPath, JSON.stringify(records, null, 2));
  console.log("Listo. Archivo JSON generado en /data/codigos.json");
}

convert();
