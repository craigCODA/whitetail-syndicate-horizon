/* Read-only GitHub Pages rendering. No network requests to Shopify Admin, no checkout, no form submissions. */
(() => {
  "use strict";
  const archive = "preview-catalog.json";
  const page = document.body.dataset.previewPage || "home";
  const query = new URLSearchParams(window.location.search);
  const coverImages = {
    "the-buck-collection":"assets/ws-line-buck-live.png",
    "the-doe-collection":"assets/ws-line-doe-live.png",
    "the-yearling-collection":"assets/ws-line-yearling-live.png",
    "the-fawn-collection":"assets/ws-line-fawn-live.png",
    "hats-beanies":"https://cdn.shopify.com/s/files/1/0689/1087/4727/files/ws-collection-hats-beanies-2026.png?v=1791440900",
    "gear-accessories":"https://cdn.shopify.com/s/files/1/0689/1087/4727/files/ws-collection-gear-accessories-2026.png?v=1791440907"
  };
  const featuredHandles = [
    "oversized-cotton-hoodie",
    "all-over-print-beanie",
    "all-over-print-beanie-1",
    "camouflage-trucker-hat-1"
  ];
  document.querySelectorAll("form[data-preview-only]").forEach(form => {
    form.addEventListener("submit", ev => ev.preventDefault());
  });

  function el(tag, opts={}) {
    const e=document.createElement(tag);
    if (opts.className) e.className=opts.className;
    if (opts.text!==undefined) e.textContent=opts.text;
    if (opts.href) e.setAttribute("href",opts.href);
    if (opts.alt!==undefined) e.alt=opts.alt;
    if (opts.src) e.setAttribute("src",opts.src);
    return e;
  }
  function img(product, className) {
    const image=el("img",{src:product.image,alt:product.alt || product.title,className});
    image.loading="lazy";
    image.decoding="async";
    image.addEventListener("error",() => {
      image.style.display="none";
      const fallback=el("p",{text:"Product image unavailable in this preview."});
      fallback.className="preview-disabled-label";
      image.parentElement?.appendChild(fallback);
    },{once:true});
    return image;
  }
  function money(price) {
    const number=Number(price);
    return price == null || !Number.isFinite(number)?"":new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(number);
  }
  function urlFor(product, collectionHandle) {
    return "product.html?collection="+encodeURIComponent(collectionHandle)+"&product="+encodeURIComponent(product.handle);
  }
  function allProducts(catalog) {
    return Object.values(catalog.collections).flatMap(collection => collection.products.map(product => ({collection:collection.handle,product})));
  }
  function problem(target,message) {
    if(!target)return;
    target.replaceChildren(el("p",{className:"preview-load-error",text:message}));
  }
  async function loadCatalog(){
    const response=await fetch(archive,{cache:"no-store"});
    if(!response.ok)throw new Error("Catalog HTTP "+response.status);
    const result=await response.json();
    if(!result.collections||!Object.keys(result.collections).length)throw new Error("Missing catalog data");
    return result;
  }
  function renderFeatured(catalog){
    const root=document.getElementById("featured-products");
    if(!root)return;
    root.replaceChildren();
    const products=allProducts(catalog);
    for(const handle of featuredHandles) {
      const hit=products.find(item=>item.product.handle===handle);
      if(!hit)continue;
      const {product,collection}=hit;
      const card=el("a",{href:urlFor(product,collection),className:"ws-product"});
      const shot=el("div",{className:"ws-product__shot"});
      shot.appendChild(img(product));
      const meta=el("div",{className:"ws-product__meta"});
      meta.appendChild(el("h3",{text:product.title}));
      const price=money(product.price);
      if(price)meta.appendChild(el("p",{className:"ws-price",text:price}));
      card.append(shot,meta);
      root.appendChild(card);
    }
    if(!root.children.length)problem(root,"Featured products were not available in the verified catalog snapshot.");
  }
  function renderCollection(catalog){
    const target=document.getElementById("collection-content");
    if(!target)return;
    const handle=query.get("handle");
    const c=catalog.collections[handle];
    if(!c){problem(target,"That collection is not available in the preview catalog.");return;}
    document.title=c.title+" | Whitetail Syndicate Preview";
    const section=el("section",{className:"collection-cover"});
    const cover=el("img",{className:"collection-cover__image",src:coverImages[handle]||c.cover,alt:c.title});
    cover.loading="eager";
    const info=el("div");
    info.appendChild(el("p",{className:"collection-cover__label",text:"The collections / Website preview"}));
    info.appendChild(el("h1",{text:c.title}));
    info.appendChild(el("p",{className:"collection-cover__description",text:"The original Whitetail Syndicate product photographs, arranged as a preview of this collection. Shopping and checkout are disabled."}));
    info.appendChild(el("p",{className:"collection-cover__count",text:c.products.length+" products · Catalog snapshot"}));
    section.append(cover,info);
    const grid=el("div",{className:"collection-grid"});
    for(const product of c.products){
      const a=el("a",{className:"collection-product",href:urlFor(product,c.handle)});
      a.appendChild(img(product));
      const meta=el("div",{className:"collection-product__body"});
      meta.appendChild(el("strong",{text:product.title}));
      const price=money(product.price);
      if(price)meta.appendChild(el("small",{text:price+" · Preview only"}));
      a.appendChild(meta);
      grid.appendChild(a);
    }
    target.replaceChildren(section,grid);
  }
  function renderProduct(catalog){
    const target=document.getElementById("product-content");
    if(!target)return;
    const handle=query.get("collection");
    const productHandle=query.get("product");
    const c=catalog.collections[handle];
    const product=c?.products.find(p=>p.handle===productHandle);
    if(!product){problem(target,"That product is not in the verified preview catalog.");return;}
    const back=document.getElementById("product-back");
    if(back)back.href="collection.html?handle="+encodeURIComponent(handle);
    document.title=product.title+" | Whitetail Syndicate Preview";
    const section=el("section",{className:"preview-detail"});
    section.appendChild(img(product,"preview-detail__photo"));
    const info=el("div");
    info.appendChild(el("p",{className:"collection-cover__label",text:c.title+" · Product preview"}));
    info.appendChild(el("h1",{text:product.title}));
    const price=money(product.price);
    if(price)info.appendChild(el("p",{className:"preview-detail__price",text:price}));
    info.appendChild(el("p",{className:"preview-detail__info",text:"This is the original merchandise image and product listing from Whitetail Syndicate's Shopify catalog. This public preview does not process orders or display live stock."}));
    info.appendChild(el("p",{className:"preview-disabled-label",text:"Preview only. To purchase, wait for the official store launch."}));
    info.appendChild(el("a",{className:"preview-backlink",href:"collection.html?handle="+encodeURIComponent(handle),text:"← Browse "+c.title}));
    section.appendChild(info);
    target.replaceChildren(section);
  }
  loadCatalog().then(catalog=>{
    if(page==="home")renderFeatured(catalog);
    else if(page==="collection")renderCollection(catalog);
    else if(page==="product")renderProduct(catalog);
  }).catch(err=>{
    const target=page==="home"?document.getElementById("featured-products"):document.getElementById(page+"-content");
    problem(target,"The preview catalog could not load. Refresh the page or try again later.");
    console.warn("Read-only preview catalog:",err.message);
  });
})();