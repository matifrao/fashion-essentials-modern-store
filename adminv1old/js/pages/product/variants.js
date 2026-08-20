/*==========================================================
  NexPage Commerce Platform

  File: variants.js
  Description: Product Variant Manager

  Module: Catalog / Products

  Version: 1.0.0

  Copyright © NexPage. All Rights Reserved.
==========================================================*/

class ProductVariants {

    constructor() {

        this.variantEnabled = document.getElementById("variantEnabled");

        this.optionName = document.getElementById("variantOptionName");

        this.optionValues = document.getElementById("variantOptionValues");

        this.generateButton = document.getElementById("generateVariants");

        this.variantTable = document.getElementById("variantTable");

        this.variants = [];

    }

    /*======================================================
      Initialize
    ======================================================*/

    init() {

        this.bindEvents();

        this.render();

    }

    /*======================================================
      Events
    ======================================================*/

    bindEvents() {

        this.generateButton?.addEventListener("click", () => {

            this.generate();

        });

    }

    /*======================================================
      Generate Variants
    ======================================================*/

    generate() {

        if (!this.optionValues) return;

        const values = this.optionValues.value

            .split(",")

            .map(value => value.trim())

            .filter(value => value.length);

        this.variants = values.map(value => ({

            id: crypto.randomUUID(),

            option: value,

            sku: "",

            barcode: "",

            price: 0,

            comparePrice: 0,

            costPrice: 0,

            stock: 0,

            image: "",

            active: true

        }));

        this.render();

    }

    /*======================================================
      Render
    ======================================================*/

    render() {

        if (!this.variantTable) return;

        if (!this.variants.length) {

            this.variantTable.innerHTML = `

                <tr>

                    <td colspan="7">

                        No variants created.

                    </td>

                </tr>

            `;

            return;

        }

        this.variantTable.innerHTML = this.variants.map((variant,index)=>`

            <tr>

                <td>${variant.option}</td>

                <td>

                    <input
                        data-field="sku"
                        data-index="${index}"
                        value="${variant.sku}">

                </td>

                <td>

                    <input
                        type="number"
                        data-field="price"
                        data-index="${index}"
                        value="${variant.price}">

                </td>

                <td>

                    <input
                        type="number"
                        data-field="stock"
                        data-index="${index}"
                        value="${variant.stock}">

                </td>

                <td>

                    <button
                        class="btn btn-sm btn-danger deleteVariant"
                        data-index="${index}">

                        Delete

                    </button>

                </td>

            </tr>

        `).join("");

        this.bindTableEvents();

    }

    /*======================================================
      Table Events
    ======================================================*/

    bindTableEvents() {

        this.variantTable

            .querySelectorAll("input")

            .forEach(input=>{

                input.addEventListener("input",()=>{

                    const index=Number(input.dataset.index);

                    const field=input.dataset.field;

                    this.variants[index][field]=input.value;

                });

            });

        this.variantTable

            .querySelectorAll(".deleteVariant")

            .forEach(button=>{

                button.addEventListener("click",()=>{

                    this.remove(

                        Number(button.dataset.index)

                    );

                });

            });

    }

    /*======================================================
      Remove Variant
    ======================================================*/

    remove(index) {

        this.variants.splice(index,1);

        this.render();

    }

    /*======================================================
      Validation
    ======================================================*/

    validate() {

        return {

            valid:true,

            message:""

        };

    }

    /*======================================================
      Get Data
    ======================================================*/

    getData() {

        return this.variants;

    }

    /*======================================================
      Set Data
    ======================================================*/

    setData(data=[]) {

        this.variants=[...data];

        this.render();

    }

    /*======================================================
      Reset
    ======================================================*/

    reset() {

        this.variants=[];

        this.render();

    }

}

export default new ProductVariants();