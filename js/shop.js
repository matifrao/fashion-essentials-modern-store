const products = [

{
name:"Premium Hijab Tube Caps",
price:"PKR 299",
image:"images/products/cat1/p1.jpeg",
colors:["black","cream","beige","navy"]
},

{
name:"4-in-One Hijab Caps",
price:"PKR 350",
image:"images/products/cat2/p2.jpg",
colors:["olive","camel","grey"]
},

{
name:"Premium Hijab Tie Caps",
price:"PKR 350",
image:"images/products/cat3/p3.jpg",
colors:["pink","blue"]
},

{
name:"Fancy Shimmer Glitter Hijab Tie Caps",
price:"PKR 499",
image:"images/products/cat4/p4.jpg",
colors:["black","burgundy"]
},

{
name:"Casual Hijab",
price:"PKR 1,999",
image:"images/products/p5.jpg",
colors:["mint","cream"]
},

{
name:"Everyday Dress",
price:"PKR 3,999",
image:"images/products/p6.jpg",
colors:["lavender","grey"]
},

{
name:"Elegant Abaya",
price:"PKR 6,299",
image:"images/products/p7.jpg",
colors:["black","olive"]
},

{
name:"Premium Shawl",
price:"PKR 1,799",
image:"images/products/p8.jpg",
colors:["camel","navy"]
},

{
name:"Soft Hijab",
price:"PKR 2,199",
image:"images/products/p9.jpg",
colors:["mint","pink"]
},

{
name:"Flow Abaya",
price:"PKR 5,699",
image:"images/products/p10.jpg",
colors:["black","beige"]
},

{
name:"Classic Dress",
price:"PKR 4,499",
image:"images/products/p11.jpg",
colors:["blue","grey"]
},

{
name:"Modern Abaya",
price:"PKR 7,499",
image:"images/products/p12.jpg",
colors:["burgundy","black"]
},

{
name:"Minimal Hijab",
price:"PKR 2,299",
image:"images/products/p13.jpg",
colors:["cream","olive"]
},

{
name:"Daily Wear",
price:"PKR 3,299",
image:"images/products/p14.jpg",
colors:["camel","pink"]
},

{
name:"Premium Collection",
price:"PKR 6,899",
image:"images/products/p15.jpg",
colors:["navy","grey"]
},

{
name:"Soft Collection",
price:"PKR 2,999",
image:"images/products/p16.jpg",
colors:["lavender","mint"]
},

{
name:"Elegant Wear",
price:"PKR 4,899",
image:"images/products/p17.jpg",
colors:["black","cream"]
},

{
name:"Summer Hijab",
price:"PKR 2,399",
image:"images/products/p18.jpg",
colors:["beige","pink"]
},

{
name:"Luxury Dress",
price:"PKR 7,899",
image:"images/products/p19.jpg",
colors:["olive","navy"]
},

{
name:"Exclusive Abaya",
price:"PKR 8,499",
image:"images/products/p20.jpg",
colors:["black","camel"]
}

];


const grid =
document.getElementById("product-grid");


products.forEach(product=>{

grid.innerHTML += `

<article class="product-card">

<img
src="${product.image}"
alt="${product.name}"
>

<h3>${product.name}</h3>

<p class="price">
${product.price}
</p>

<div class="colors">

${product.colors
.map(
color=>

`<span class="color ${color}"></span>`

)

.join("")}

</div>

<button>
Add to Cart
</button>

</article>

`;

});