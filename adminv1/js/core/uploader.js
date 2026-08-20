/*==========================================================
  NexPage Commerce Platform

  File: uploader.js
  Description: Universal File Upload Manager

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class Uploader {

    constructor() {

        this.maxFiles = 20;

        this.maxFileSize = 5 * 1024 * 1024;

        this.allowedTypes = [

            "image/jpeg",

            "image/png",

            "image/webp",

            "image/gif"

        ];

    }

    /*======================================================
      Browse Files
    ======================================================*/

    browse(input) {

        if (!input) return;

        input.click();

    }

    /*======================================================
      Validate Files
    ======================================================*/

    validate(files = []) {

        const errors = [];

        if (files.length > this.maxFiles) {

            errors.push(

                `Maximum ${this.maxFiles} files allowed.`

            );

        }

        [...files].forEach(file => {

            if (

                !this.allowedTypes.includes(file.type)

            ) {

                errors.push(

                    `${file.name} has an invalid format.`

                );

            }

            if (

                file.size > this.maxFileSize

            ) {

                errors.push(

                    `${file.name} exceeds 5 MB.`

                );

            }

        });

        return {

            valid: errors.length === 0,

            errors

        };

    }

    /*======================================================
      Read Files
    ======================================================*/

    async read(files = []) {

        const result = [];

        for (const file of files) {

            const data = await this.readFile(file);

            result.push({

                id: crypto.randomUUID(),

                name: file.name,

                type: file.type,

                size: file.size,

                file,

                url: data

            });

        }

        return result;

    }

    /*======================================================
      Read Single File
    ======================================================*/

    readFile(file) {

        return new Promise(resolve => {

            const reader = new FileReader();

            reader.onload = event => {

                resolve(event.target.result);

            };

            reader.readAsDataURL(file);

        });

    }

    /*======================================================
      Upload
    ======================================================*/

    async upload(endpoint, files = []) {

        const formData = new FormData();

        [...files].forEach(file => {

            formData.append(

                "files",

                file

            );

        });

        const response = await fetch(endpoint, {

            method: "POST",

            body: formData

        });

        if (!response.ok) {

            throw new Error(

                "Upload failed."

            );

        }

        return response.json();

    }

    /*======================================================
      Remove File
    ======================================================*/

    remove(list, id) {

        return list.filter(item => item.id !== id);

    }

    /*======================================================
      Reorder
    ======================================================*/

    move(list, from, to) {

        const items = [...list];

        const [item] = items.splice(from, 1);

        items.splice(to, 0, item);

        return items;

    }

    /*======================================================
      Bytes
    ======================================================*/

    formatSize(bytes) {

        if (bytes < 1024)

            return `${bytes} B`;

        if (bytes < 1048576)

            return `${(bytes / 1024).toFixed(1)} KB`;

        return `${(bytes / 1048576).toFixed(2)} MB`;

    }

}

export default new Uploader();