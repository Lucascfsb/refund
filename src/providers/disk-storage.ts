import fs from "node:fs";
import path from "node:path";

import uploadsConfig from "@/configs/upload";

class DiskStorage {
  async saveFile(file: string): Promise<string> {
    const tmpPath = path.resolve(uploadsConfig.TMP_FOLDER, file);
    const targetPath = path.resolve(uploadsConfig.UPLOADS_FOLDER, file);

    try {
      await fs.promises.access(tmpPath);
    } catch (error) {
      console.log(error);
      throw new Error(`Error saving file: ${error}`);
    }

    await fs.promises.mkdir(uploadsConfig.UPLOADS_FOLDER, { recursive: true });

    await fs.promises.rename(tmpPath, targetPath);

    return file;
  }

  async deleteFile(file: string, type: "tmp" | "upload"): Promise<void> {
    const pathFile =
      type === "tmp" ? uploadsConfig.TMP_FOLDER : uploadsConfig.UPLOADS_FOLDER;

    const filePath = path.resolve(pathFile, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorage;
