//=============================================================================
// SAN_FileDeleter_MZ.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 未使用素材ファイル削除（MZ対応版） 1.2.0-mz
 * 使用前に必ずバックアップを取ってください。
 * @author サンシロ (MZ port by ChatGPT)
 *
 * @command ListUnusedFiles
 * @text 未使用候補を一覧出力（削除なし）
 * @desc 未使用候補ファイル一覧をコンソールとファイルに出力します（削除しません）
 *
 * @command DeleteFiles
 * @text 未使用ファイル削除
 * @desc img/audio内の未使用素材を削除します（テスト起動時のみ）
 *
 * @help
 * ■実行方法
 * プラグインコマンド:
 *   SAN_FileDeleter_MZ ListUnusedFiles
 *   SAN_FileDeleter_MZ DeleteFiles
 *
 * またはスクリプト:
 *   StorageManager.listUnusedFiles()
 *   StorageManager.deleteFiles()
 *
 * ■出力ファイル
 * プロジェクト直下に以下を出力します:
 *   unused_files.txt
 *
 * テスト起動時以外では動作せずエラーになります。
 */

var Imported = Imported || {};
Imported.SAN_FileDeleter_MZ = true;

(() => {
'use strict';

const pluginName = "SAN_FileDeleter_MZ";

//-----------------------------------------------------------------------------
// FileDeleter (static)
//-----------------------------------------------------------------------------

function FileDeleter() {
    throw new Error("This is a static class");
}

FileDeleter._assetFilePathList = [];
FileDeleter._controlFilePathList = [];
FileDeleter._usedFilePathList = [];
FileDeleter._unusedFilePathList = [];
FileDeleter._controlFileCache = {};

FileDeleter.indexDirectoryPath = function() {
    const path = require("path");
    const dirName = path.dirname(process.mainModule.filename);
    return decodeURIComponent(dirName);
};

FileDeleter.dataDirectoryPath = function() {
    return this.indexDirectoryPath() + "/data";
};

FileDeleter.jsDirectoryPath = function() {
    return this.indexDirectoryPath() + "/js";
};

FileDeleter.imgDirectoryPath = function() {
    return this.indexDirectoryPath() + "/img";
};

FileDeleter.audioDirectoryPath = function() {
    return this.indexDirectoryPath() + "/audio";
};

FileDeleter.setupFilePathLists = function() {
    this.setupAssetFilePathList();
    this.setupControlFilePathList();
    this.setupUsedFilePathList();
    this.setupUnusedFilePathList();
};

FileDeleter.clearFilePathLists = function() {
    this._assetFilePathList = [];
    this._controlFilePathList = [];
    this._usedFilePathList = [];
    this._unusedFilePathList = [];
};

FileDeleter.clearControlFileCache = function() {
    this._controlFileCache = {};
};

FileDeleter.setupAssetFilePathList = function() {
    const filePathList = [];
    this.walkDirectory(this.imgDirectoryPath(), filePathList);
    this.walkDirectory(this.audioDirectoryPath(), filePathList);
    this._assetFilePathList = filePathList;
};

FileDeleter.setupControlFilePathList = function() {
    const filePathList = [];
    this.walkDirectory(this.dataDirectoryPath(), filePathList);
    this.walkDirectory(this.jsDirectoryPath(), filePathList);
    this._controlFilePathList = filePathList;
};

FileDeleter.setupUsedFilePathList = function() {
    const filePathList = [];

    for (let i = 0; i < this._assetFilePathList.length; i++) {
        const assetFilePath = this._assetFilePathList[i];

        for (let j = 0; j < this._controlFilePathList.length; j++) {
            const controlFilePath = this._controlFilePathList[j];

            if (this.assetFileIsUsed(controlFilePath, assetFilePath)) {
                filePathList.push(assetFilePath);
                break;
            }
        }
    }

    this._usedFilePathList = filePathList;
};

FileDeleter.setupUnusedFilePathList = function() {
    const filePathList = this._assetFilePathList.filter(assetFilePath => {
        return this._usedFilePathList.indexOf(assetFilePath) === -1;
    });
    this._unusedFilePathList = filePathList;
};

FileDeleter.walkDirectory = function(directoryPath, filePathList) {
    const fs = require("fs");
    const fileNames = fs.readdirSync(directoryPath);

    fileNames.forEach(fileName => {
        const filePath = directoryPath + "/" + fileName;

        if (fs.statSync(filePath).isDirectory()) {
            this.walkDirectory(filePath, filePathList);
        } else {
            filePathList.push(filePath);
        }
    });
};

FileDeleter.assetFileIsUsed = function(controlFilePath, assetFilePath) {
    const path = require("path");
    const controlFileText = this.controlFileText(controlFilePath);

    const assetFileExt = path.extname(assetFilePath);
    const assetFileName = path.basename(assetFilePath, assetFileExt);

    const regExp = new RegExp(this.escapeRegExp(assetFileName));
    return controlFileText.search(regExp) !== -1;
};

FileDeleter.controlFileText = function(controlFilePath) {
    if (this._controlFileCache[controlFilePath]) {
        return this._controlFileCache[controlFilePath];
    }

    const fs = require("fs");
    const text = fs.readFileSync(controlFilePath, "utf-8");
    this._controlFileCache[controlFilePath] = text;
    return text;
};

FileDeleter.escapeRegExp = function(string) {
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
};

// 削除予定ファイル一覧を文字列として作る
FileDeleter.makeUnusedFileReportText = function() {
    const lines = [];
    lines.push("======== SAN_FileDeleter UNUSED FILE LIST ========");
    lines.push("assets  : " + this._assetFilePathList.length);
    lines.push("used    : " + this._usedFilePathList.length);
    lines.push("unused  : " + this._unusedFilePathList.length);
    lines.push("");
    lines.push("---- unused file paths ----");

    this._unusedFilePathList.forEach(path => {
        lines.push(path);
    });

    lines.push("");
    return lines.join("\n");
};

// 未使用候補一覧をファイルに保存
FileDeleter.saveUnusedFileListToFile = function() {
    const fs = require("fs");
    const path = require("path");

    const reportText = this.makeUnusedFileReportText();
    const outputPath = path.join(this.indexDirectoryPath(), "unused_files.txt");

    fs.writeFileSync(outputPath, reportText, "utf-8");

    console.log("SAN_FileDeleter: unused file list saved -> " + outputPath);
};

// 未使用候補一覧の出力（削除なし）
FileDeleter.listUnusedFiles = function() {
    this.setupFilePathLists();

    const reportText = this.makeUnusedFileReportText();
    console.log(reportText);

    this.saveUnusedFileListToFile();

    this.clearFilePathLists();
    this.clearControlFileCache();
};

// 未使用素材ファイルの削除
FileDeleter.deleteUnusedFiles = function() {
    this.setupFilePathLists();
    this.deleteFiles(this._unusedFilePathList);
    this.printFdStats();
    this.clearFilePathLists();
    this.clearControlFileCache();
};

FileDeleter.deleteFiles = function(filePathList) {
    const fs = require("fs");
    filePathList.forEach(filePath => {
        fs.unlinkSync(filePath);
    });
};

FileDeleter.printFdStats = function() {
    console.log("======== SAN_FileDeleter ========");
    console.log("files asset   : ", this._assetFilePathList.length);
    console.log("files used    : ", this._usedFilePathList.length);
    console.log("files deleted : ", this._unusedFilePathList.length);
};

//-----------------------------------------------------------------------------
// StorageManager
//-----------------------------------------------------------------------------

StorageManager.deleteFiles = function() {
    if (this.isLocalMode() && Utils.isOptionValid("test")) {
        FileDeleter.deleteUnusedFiles();
    } else {
        throw new Error("SAN_FileDeleter : It is not local test mode");
    }
};

StorageManager.listUnusedFiles = function() {
    if (this.isLocalMode() && Utils.isOptionValid("test")) {
        FileDeleter.listUnusedFiles();
    } else {
        throw new Error("SAN_FileDeleter : It is not local test mode");
    }
};

//-----------------------------------------------------------------------------
// Plugin Command (MZ)
//-----------------------------------------------------------------------------

PluginManager.registerCommand(pluginName, "ListUnusedFiles", () => {
    StorageManager.listUnusedFiles();
});

PluginManager.registerCommand(pluginName, "DeleteFiles", () => {
    StorageManager.deleteFiles();
});

})();