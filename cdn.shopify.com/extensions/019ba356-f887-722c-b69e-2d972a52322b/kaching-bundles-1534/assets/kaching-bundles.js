const Vt = () => {
  try {
    const i = "kaching_local_storage_test";
    return localStorage.setItem(i, i), localStorage.removeItem(i), !0;
  } catch {
    return !1;
  }
}, G = Vt() ? window.localStorage : window.sessionStorage, X = () => new URLSearchParams(window.location.search).get("kaching");
let Y;
const Mt = () => (Y === void 0 && (Y = X() === "off"), Y);
let Z;
const J = () => (Z === void 0 && (Z = X() === "debug"), Z);
let tt;
const vt = () => (tt === void 0 && (tt = X() === "dev"), tt);
let et;
const $t = () => (et === void 0 && (et = X() === "info"), et), xt = async (i, t, e, n, r) => {
  try {
    const a = "kaching_visited_deal_blocks", o = G.getItem(a), s = o ? JSON.parse(o) : [];
    if (s.includes(t))
      return;
    s.push(t), G.setItem(a, JSON.stringify(s)), await fetch("https://bundles-stats.kachingappz.app/impressions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        shopDomain: i,
        dealBlockId: t,
        productId: e,
        abTestVariantId: n,
        sessionId: r
      }),
      keepalive: !0
    });
  } catch (a) {
    console.error(a);
  }
}, C = async (i, t = {}, e = 1) => {
  if (p("sendStorefrontEvent", { name: i, data: t }), Math.random() > e)
    return;
  const n = window.location.href;
  return await fetch(
    "https://storefront-events.kachingappz.app/bundles/events",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event: { name: i, data: t, url: n, shop: window.Shopify.shop }
      })
    }
  );
};
let ut = !1;
const dt = async (i, t, e, n = 0.1) => {
  if (ut || Math.random() > n || t === "Failed to fetch" || t && (t.includes(
    "Cannot define multiple custom elements with the same tag name"
  ) || t.includes(
    "Failed to execute 'define' on 'CustomElementRegistry'"
  ) || t.includes("CustomElementRegistry.define")))
    return;
  const r = window.location.href, a = window.Shopify.shop;
  return ut = !0, await fetch(
    "https://storefront-events.kachingappz.app/bundles/errors",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: { filename: i, message: t, stack: e, url: r, shop: a }
      })
    }
  );
}, Gt = () => {
  const i = ["kaching-bundles.js", "kaching-bundles-block.js"];
  window.addEventListener("error", async function(t) {
    const e = async (n) => {
      const { filename: r, message: a, error: o } = n;
      for (const s of i)
        if (r.includes(s)) {
          if (J() || pt()) {
            p("Error", n);
            return;
          }
          await dt(r, a, o.stack);
        }
    };
    try {
      await e(t);
    } catch (n) {
      console.error(n);
    }
  }), window.addEventListener("unhandledrejection", async function(t) {
    const e = async (n) => {
      if (typeof n.reason != "object")
        return;
      const { message: r, stack: a } = n.reason;
      if (a) {
        for (const o of i)
          if (a.includes(o)) {
            if (J() || pt()) {
              p("Unhandled rejection", n);
              return;
            }
            await dt(o, r, a);
          }
      }
    };
    try {
      await e(t);
    } catch (n) {
      console.error(n);
    }
  });
};
function p(i, t = null) {
  !J() && !vt() || console.debug("[Kaching Bundles]", i, t);
}
function v(i, t = null) {
  !$t() && !J() && !vt() || console.info("[Kaching Bundles]", i, t);
}
const Lt = () => {
  const i = (n) => {
    window.dispatchEvent(new Event(n));
  }, t = history.pushState;
  history.pushState = function(...r) {
    const a = t.apply(this, r);
    return i("pushstate"), i("locationchange"), a;
  };
  const e = history.replaceState;
  history.replaceState = function(...r) {
    const a = e.apply(this, r);
    return i("replacestate"), i("locationchange"), a;
  }, F(window, "popstate", () => {
    i("locationchange");
  });
}, rt = (i, t, e, n = 0) => {
  const r = Object.getPrototypeOf(i);
  if (r.hasOwnProperty(t)) {
    const a = Object.getOwnPropertyDescriptor(
      r,
      t
    );
    if (!a.configurable)
      return;
    Object.defineProperty(i, t, {
      configurable: !0,
      get: function(...o) {
        return a.get.apply(this, o);
      },
      set: function(...o) {
        const s = this[t];
        a.set.apply(this, o);
        const l = this[t];
        return typeof e == "function" && setTimeout(e.bind(this, s, l), n), l;
      }
    });
  }
}, D = (i, t = document) => {
  try {
    return t.querySelector(i);
  } catch {
    return null;
  }
}, k = (i, t = document) => {
  try {
    return [...t.querySelectorAll(i)];
  } catch {
    return [];
  }
}, F = (i, t, e) => i.addEventListener(t, e), K = (i) => document.createElement(i), Rt = (i, t) => i && i.classList.add(t), P = (i, t, e) => i.setAttribute(t, e), O = (i) => i.dataset, U = (i) => {
  const t = D(i);
  if (!t)
    return;
  const e = JSON.parse(t.textContent);
  return p("jsonFromElement", e), e;
}, Qt = (i, t) => {
  let e = 0, n = i;
  for (; n !== t && n !== document.body; )
    e++, n = n.parentNode;
  if (n !== t)
    throw new Error(
      "The specified child node is not a descendant of the parent node."
    );
  return e;
}, Ut = (i, t) => {
  if (i === t)
    return i;
  const e = /* @__PURE__ */ new Set();
  let n = i;
  for (; n; )
    e.add(n), n = n.parentElement;
  for (n = t; n; ) {
    if (e.has(n))
      return n;
    n = n.parentElement;
  }
  return document.documentElement;
}, nt = (i, t, e = 1 / 0) => {
  let n = null, r = 1 / 0;
  for (const a of t) {
    const o = Ut(i, a), s = Qt(i, o);
    s > e || s < r && (n = a, r = s);
  }
  return n;
}, pt = () => {
  const i = document.currentScript;
  return i ? i.src.includes("kaching-bundles-dev") : !1;
}, W = (i, t = {}) => {
  const e = window.Shopify.routes, r = (e && e.root || "/") + i, a = new URLSearchParams();
  for (const [s, l] of Object.entries(t))
    a.append(s, l);
  const o = a.toString();
  return o ? `${r}?${o}` : r;
}, M = (i, t) => {
  new MutationObserver((n, r) => {
    for (const a of n)
      a.type === "childList" && a.removedNodes.forEach((o) => {
        o.contains(i) && (r.disconnect(), t());
      });
  }).observe(document.body, { childList: !0, subtree: !0 });
}, zt = (i, t) => i.reduce((e, n, r) => {
  const a = Math.floor(r / t);
  return e[a] || (e[a] = []), e[a].push(n), e;
}, []), jt = (i, t = 300, e = 100) => {
  let n = 0;
  const r = () => {
    window.Shopify.analytics ? i() : n < t ? (n++, setTimeout(r, e)) : C(
      "shopify_analytics_missing",
      {
        userAgent: navigator.userAgent
      },
      0.1
    );
  };
  r();
}, Ht = () => {
  const i = /\b__kaching_/, t = ["script", "style"], e = (r) => {
    const a = document.createTreeWalker(r, NodeFilter.SHOW_TEXT, {
      acceptNode: (s) => {
        const l = s.parentElement;
        return !l || t.includes(l.tagName.toLowerCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    let o;
    for (; o = a.nextNode(); ) {
      const s = o.textContent || "";
      if (i.test(s)) {
        const l = o.parentElement;
        if (l.classList.contains("properties-key-value-key"))
          continue;
        if (l.tagName.toLowerCase() === "dt") {
          const c = l.nextElementSibling;
          (c == null ? void 0 : c.tagName.toLowerCase()) === "dd" && (c.style.display = "none");
        }
        l.style.display = "none", C(
          "kaching_property_hidden",
          {
            text: s,
            element: l.tagName
          },
          0.01
        );
      }
    }
  };
  new MutationObserver((r) => {
    for (const a of r)
      for (const o of a.addedNodes)
        o.nodeType === Node.ELEMENT_NODE && e(o);
  }).observe(document.body, {
    childList: !0,
    subtree: !0
  }), e(document.body);
}, Jt = () => {
  const i = document.querySelector('link[href*="kaching-bundles.css"]');
  if (!i) return;
  const t = i.closest(
    'div[data-block-type="liquid"]'
  );
  t && (t.dataset.blockType = "liquid-kaching-fix");
}, L = ({
  country: i,
  language: t
}) => {
  const e = [];
  return i && e.push(`country: ${i}`), t && e.push(`language: ${t}`), e.length > 0 ? `@inContext(${e.join(", ")})` : "";
}, Kt = async (i, {
  productId: t,
  country: e,
  language: n
}) => {
  var a;
  const r = L({ country: e, language: n });
  return ((a = (await i.query(
    `
      query FetchComplementaryProductGIDs($productGID: ID!) ${r} {
        productRecommendations(productId: $productGID, intent: COMPLEMENTARY) {
          id
        }
      }
    `,
    {
      variables: {
        productGID: `gid://shopify/Product/${t}`
      }
    }
  )).productRecommendations) == null ? void 0 : a.map((o) => o.id)) || [];
}, St = async (i, {
  useExternalMetafieldNamespace: t
}) => {
  var n;
  const e = (n = (await i.query(
    `
      query FetchDealBlocks($metafieldNamespace: String!) {
        shop {
          metafield(namespace: $metafieldNamespace, key: "deal_blocks") {
            value
          }
        }
      }
    `,
    {
      variables: {
        metafieldNamespace: "$app:kaching_bundles"
      }
    }
  )).shop.metafield) == null ? void 0 : n.value;
  return e ? JSON.parse(e) : [];
}, Wt = async (i, t, e = 200) => (t = t.filter(Boolean).filter((n) => !n.startsWith("placeholder")), t.length === 0 ? [] : (await i.query(
  `
      query FetchMediaImages($mediaImageIds: [ID!]!, $size: Int!) {
        nodes(ids: $mediaImageIds) {
          ... on MediaImage {
            id
            image {
              url(transform: { maxWidth: $size, maxHeight: $size })
            }
          }
        }
      }
    `,
  {
    variables: {
      mediaImageIds: t,
      size: e
    }
  }
)).nodes.filter(Boolean).map((n) => ({
  gid: n.id,
  url: n.image.url
}))), Xt = async (i, t) => {
  if (!t.length) return [];
  const e = t.map((n) => `gid://shopify/Product/${n}`);
  return (await i.query(
    `
      query FetchNativeBundleProductIds($productGIDs: [ID!]!) {
        nodes(ids: $productGIDs) {
          ... on Product {
            id
            variants(first: 1) {
              nodes {
                requiresComponents
              }
            }
          }
        }
      }
    `,
    { variables: { productGIDs: e } }
  )).nodes.filter((n) => n !== null).filter(
    (n) => n.variants.nodes.some((r) => r.requiresComponents)
  ).map((n) => Number(n.id.split("/").pop()));
}, Yt = async (i, {
  country: t,
  language: e,
  blockVisibility: n,
  excludedProductGIDs: r,
  selectedProductGIDs: a,
  selectedCollectionGIDs: o,
  limit: s = 250
}) => {
  switch (n) {
    case "selected-products":
      return a.slice(0, s);
    case "all-products":
    case "excluded-products": {
      const l = L({ country: t, language: e });
      let c = (await i.query(
        `
          query FetchProductGIDs($limit: Int!) ${l} {
            products(first: $limit) {
              nodes {
                id
              }
            }
          }
        `,
        {
          variables: {
            limit: s
          }
        }
      )).products.nodes.map((d) => d.id);
      return n === "excluded-products" && (c = c.filter(
        (d) => !r.includes(d)
      )), c;
    }
    case "selected-collections": {
      const l = L({ country: t, language: e }), c = (await i.query(
        `
          query FetchCollectionProductGIDs($collectionGIDs: [ID!]!, $limit: Int!) ${l} {
            nodes(ids: $collectionGIDs) {
              ... on Collection {
                products(first: $limit) {
                  nodes {
                    id
                  }
                }
              }
            }
          }
        `,
        {
          variables: {
            collectionGIDs: o,
            limit: s
          }
        }
      )).nodes.filter((d) => d !== null).flatMap(
        (d) => d.products.nodes.map((h) => h.id)
      );
      return Array.from(new Set(c)).slice(0, s);
    }
  }
}, Pt = `
  id
  availableForSale
  price {
    amount
  }
  compareAtPrice {
    amount
  }
  selectedOptions {
    name
    value
  }
  image {
    id
    url(transform: { maxWidth: 200, maxHeight: 200 })
  }
  unitPriceMeasurement {
    quantityUnit
    quantityValue
    referenceUnit
    referenceValue
  }
  requiresComponents
  sellingPlanAllocations(first: 100) @include(if: $includeSellingPlans) {
    nodes {
      sellingPlan {
        id
      }
      priceAdjustments {
        price {
          amount
        }
      }
    }
  }
  quantityAvailable @include(if: $includeAvailableQuantity)
`, z = async (i, {
  country: t,
  language: e,
  productIds: n,
  includeSellingPlans: r = !0,
  includeAvailableQuantity: a = !0,
  useExternalMetafieldNamespace: o = !1
}) => {
  if (!n.length)
    return [];
  const s = n.map((d) => typeof d == "string" && d.startsWith("gid://") ? d : `gid://shopify/Product/${d}`), l = L({ country: t, language: e });
  let c = (await i.query(
    `
      query FetchProducts($productGIDs: [ID!]!, $includeSellingPlans: Boolean!, $includeAvailableQuantity: Boolean!, $metafieldNamespace: String!) ${l} {
        nodes(ids: $productGIDs) {
          ... on Product {
            id
            handle
            onlineStoreUrl
            availableForSale
            title
            featuredImage {
              url
            }
            options {
              name
              optionValues {
                id
                name
                swatch {
                  color
                  image {
                    previewImage {
                      url(transform: { maxWidth: 200, maxHeight: 200 })
                    }
                  }
                }
              }
            }
            variants(first: 250) {
              nodes {
                ${Pt}
              }
            }
            collections(first: 50) {
              nodes {
                id
              }
            }
            metafield: metafield(namespace: $metafieldNamespace, key: "text") {
              value
            }
            metafield2: metafield(namespace: $metafieldNamespace, key: "text2") {
              value
            }
            metafield3: metafield(namespace: $metafieldNamespace, key: "text3") {
              value
            }
            metafield4: metafield(namespace: $metafieldNamespace, key: "text4") {
              value
            }
            legacy_metafield_text: metafield(namespace: "kaching_bundles", key: "text") {
              value
            }
            legacy_metafield_text2: metafield(namespace: "kaching_bundles", key: "text2") {
              value
            }
            requiresSellingPlan
            sellingPlanGroups(first: 100) @include(if: $includeSellingPlans) {
              nodes {
                sellingPlans(first: 100) {
                  nodes {
                    id
                    name
                    priceAdjustments {
                      adjustmentValue {
                        __typename
                        ... on SellingPlanPercentagePriceAdjustment {
                          adjustmentPercentage
                        }
                        ... on SellingPlanFixedAmountPriceAdjustment {
                          adjustmentAmount {
                            amount
                          }
                        }
                        ... on SellingPlanFixedPriceAdjustment {
                          price {
                            amount
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        productGIDs: s,
        includeSellingPlans: r,
        includeAvailableQuantity: a,
        metafieldNamespace: o ? "app--2935586817--kaching_bundles" : "$app:kaching_bundles"
      }
    }
  )).nodes.filter(
    (d) => d != null
  );
  return c = await Promise.all(
    c.map(
      (d) => Zt(i, d, {
        includeSellingPlans: r,
        includeAvailableQuantity: a
      })
    )
  ), c.map(te);
}, Zt = async (i, t, e) => {
  if (t.variants.nodes.length < 250)
    return t;
  const n = /* @__PURE__ */ new Set(), r = [], a = [], o = async (s) => {
    let l = !0, c = null;
    for (; l; ) {
      const d = await i.query(
        `
          query($productGID: ID!, $cursor: String, $reverse: Boolean, $includeSellingPlans: Boolean!, $includeAvailableQuantity: Boolean!) {
            product(id: $productGID) {
              variants(first: 250, after: $cursor, reverse: $reverse) {
                nodes {
                  ${Pt}
                }
                pageInfo {
                  endCursor
                  hasNextPage
                }
              }
            }
          }
        `,
        {
          variables: {
            productGID: t.id,
            cursor: c,
            reverse: s,
            ...e
          }
        }
      ), { nodes: h, pageInfo: b } = d.product.variants;
      for (const I of h) {
        if (n.has(I.id)) {
          l = !1;
          break;
        }
        n.add(I.id), s ? a.push(I) : r.push(I);
      }
      b.hasNextPage || (l = !1), c = b.endCursor;
    }
  };
  return await Promise.all([
    o(!1),
    o(!0)
  ]), t.variants.nodes = [...r, ...a.reverse()], t;
}, te = (i) => {
  var o, s, l, c, d, h, b, I;
  const t = i.variants.nodes.map(
    ({ unitPriceMeasurement: m, ...g }) => {
      var u, f, w, A, y;
      return {
        id: Number(g.id.split("/").pop()),
        availableForSale: g.availableForSale,
        price: Math.round(Number(g.price.amount) * 100),
        compareAtPrice: g.compareAtPrice ? Math.round(Number(g.compareAtPrice.amount) * 100) : null,
        options: g.selectedOptions.map((_) => _.value),
        imageId: g.image ? Number(g.image.id.split("/").pop()) : null,
        image: ((u = g.image) == null ? void 0 : u.url) || null,
        sellingPlans: ((f = g.sellingPlanAllocations) == null ? void 0 : f.nodes.map((_) => ({
          id: Number(_.sellingPlan.id.split("/").pop()),
          price: _.priceAdjustments.length > 0 ? Math.round(Number(_.priceAdjustments[0].price.amount) * 100) : Math.round(Number(g.price.amount) * 100)
        }))) || [],
        inventoryManagement: null,
        // Storefront API does not return inventory management, only available in liquid
        inventoryPolicy: null,
        // Storefront API does not return inventory policy, only available in liquid
        inventoryQuantity: (w = g.quantityAvailable) != null ? w : null,
        unitPriceQuantityValue: (m == null ? void 0 : m.quantityValue) || null,
        unitPriceQuantityUnit: ((A = m == null ? void 0 : m.quantityUnit) == null ? void 0 : A.toLowerCase()) || null,
        unitPriceReferenceValue: (m == null ? void 0 : m.referenceValue) || null,
        unitPriceReferenceUnit: ((y = m == null ? void 0 : m.referenceUnit) == null ? void 0 : y.toLowerCase()) || null
      };
    }
  ), e = i.options.map((m, g) => {
    const u = m.optionValues.map((f) => {
      var w, A, y, _;
      return {
        id: Number(f.id.split("/").pop()),
        defaultName: f.name,
        name: f.name,
        swatch: {
          color: ((w = f.swatch) == null ? void 0 : w.color) || null,
          image: ((_ = (y = (A = f.swatch) == null ? void 0 : A.image) == null ? void 0 : y.previewImage) == null ? void 0 : _.url) || null
        }
      };
    });
    return {
      defaultName: m.name,
      name: m.name,
      position: g + 1,
      optionValues: ee(u, g, t)
    };
  }), n = (m) => {
    const g = m.priceAdjustments[0];
    if (!g)
      return null;
    const u = g.adjustmentValue;
    switch (u.__typename) {
      case "SellingPlanPercentagePriceAdjustment":
        return {
          type: "percentage",
          value: u.adjustmentPercentage
        };
      case "SellingPlanFixedAmountPriceAdjustment":
        return {
          type: "fixed_amount",
          value: Number(u.adjustmentAmount.amount) * 100
        };
      case "SellingPlanFixedPriceAdjustment":
        return {
          type: "price",
          value: Number(u.price.amount) * 100
        };
      default:
        throw new Error(
          `Unknown price adjustment type: ${u.__typename}`
        );
    }
  }, r = ((o = i.sellingPlanGroups) == null ? void 0 : o.nodes.flatMap(
    (m) => m.sellingPlans.nodes.map((g) => ({
      id: Number(g.id.split("/").pop()),
      name: g.name,
      priceAdjustment: n(g)
    }))
  )) || [], a = i.variants.nodes.some(
    (m) => m.requiresComponents
  );
  return {
    id: Number(i.id.split("/").pop()),
    handle: i.handle,
    url: i.onlineStoreUrl,
    availableForSale: i.availableForSale,
    title: i.title,
    image: ((s = i.featuredImage) == null ? void 0 : s.url) || null,
    collectionIds: i.collections.nodes.map(
      (m) => Number(m.id.split("/").pop())
    ),
    options: e,
    selectedVariantId: Number(
      i.variants.nodes[0].id.split("/").pop()
    ),
    variants: t,
    requiresSellingPlan: i.requiresSellingPlan,
    sellingPlans: r,
    isNativeBundle: a,
    metafields: {
      text: ((l = i.metafield) == null ? void 0 : l.value) || null,
      text2: ((c = i.metafield2) == null ? void 0 : c.value) || null,
      text3: ((d = i.metafield3) == null ? void 0 : d.value) || null,
      text4: ((h = i.metafield4) == null ? void 0 : h.value) || null
    },
    legacyMetafields: {
      kaching_bundles: {
        text: ((b = i.legacy_metafield_text) == null ? void 0 : b.value) || null,
        text2: ((I = i.legacy_metafield_text2) == null ? void 0 : I.value) || null
      }
    }
  };
}, ee = (i, t, e) => i.filter((n) => e.filter(
  (r) => r.options[t] === n.name
).length > 0), ne = async (i, t, e) => {
  const n = t.map((a) => `gid://shopify/Product/${a}`), r = L({
    country: e == null ? void 0 : e.country,
    language: e == null ? void 0 : e.language
  });
  return (await i.query(
    `
      query FetchProductsInDefaultLanguage($productGIDs: [ID!]!) ${r} {
        nodes(ids: $productGIDs) {
          ... on Product {
            id
            options {
              name
              optionValues {
                id
                name
              }
            }
          }
        }
        localization {
          country {
            isoCode
          }
          language {
            isoCode
          }
        }
      }
    `,
    {
      variables: {
        productGIDs: n
      }
    }
  )).nodes.filter((a) => a != null).map(ie);
}, ie = (i) => {
  const t = i.options.map(
    (e, n) => ({
      defaultName: e.name,
      position: n + 1,
      optionValues: e.optionValues.map((r) => ({
        id: Number(r.id.split("/").pop()),
        defaultName: r.name
      }))
    })
  );
  return {
    id: Number(i.id.split("/").pop()),
    options: t
  };
}, re = (i, t) => {
  const e = [], n = i.filter(
    (s) => s.blockVisibility === "selected-products"
  );
  for (const s of n)
    s.selectedProductIds.map(Number).includes(t.id) && e.push(s);
  const r = i.filter(
    (s) => s.blockVisibility === "selected-collections"
  );
  for (const s of r)
    t.collectionIds.some(
      (l) => s.selectedCollectionIds.map(Number).includes(l)
    ) && e.push(s);
  const a = i.filter(
    (s) => s.blockVisibility === "excluded-products"
  );
  for (const s of a)
    !s.excludedProductIds.map(Number).includes(t.id) && !(s.excludedCollectionIds || []).some(
      (l) => t.collectionIds.includes(l)
    ) && e.push(s);
  const o = i.filter(
    (s) => s.blockVisibility === "all-products"
  );
  for (const s of o)
    e.push(s);
  return e;
}, ae = (i) => [
  ...se(i),
  ...oe(i),
  ...le(i),
  ...ce(i),
  ...ue(i),
  ...de(i),
  ...pe(i)
].filter((t) => t != null && !t.includes("placeholder")), se = (i) => i.dealBars.map((t) => t.mediaImageGID).filter((t) => t != null), oe = (i) => i.dealBars.map(
  ({ freeGifts: t }) => (t || []).map((e) => e.mediaImageGID)
).reduce((t, e) => t.concat(e), []).filter((t) => t != null), le = (i) => i.dealBars.map(({ upsells: t }) => (t || []).map((e) => e.mediaImageGID)).reduce((t, e) => t.concat(e), []).filter((t) => t != null), ce = (i) => i.swatchOptions ? i.swatchOptions.reduce((t, e) => {
  const n = e.images.map((r) => r.mediaImageGID).filter((r) => r != null);
  return [...t, ...n];
}, []) : [], ue = (i) => {
  if (!i.collectionBreaksEnabled || !i.collectionBreaks)
    return [];
  const t = i.collectionBreaks.mediaImageGID;
  return t ? [t] : [];
}, de = (i) => {
  var t, e;
  return i.progressiveGifts ? [
    ...((t = i.progressiveGifts.gifts) == null ? void 0 : t.map((n) => n.mediaImageGID)) || [],
    (e = i.progressiveGifts.style) == null ? void 0 : e.lockedMediaImageGID
  ].filter((n) => n != null) : [];
}, pe = (i) => !i.checkboxUpsellsEnabled || !i.checkboxUpsells ? [] : i.checkboxUpsells.upsells.map((t) => t.mediaImageGID).filter((t) => t != null), he = (i) => {
  const t = [
    ...fe(i),
    ...me(i),
    ...ge(i),
    ..._e(i),
    ...ye(i),
    ...be(i)
  ];
  return Array.from(new Set(t.filter((e) => e != null)));
}, fe = (i) => i.dealBars.flatMap(
  ({ freeGifts: t }) => t ? t.map((e) => e.productGID) : []
).filter((t) => t != null), me = (i) => {
  var t;
  return i.progressiveGiftsEnabled ? ((t = i.progressiveGifts) == null ? void 0 : t.gifts.map((e) => e.productGID).filter((e) => e != null)) || [] : [];
}, ge = (i) => i.dealBars.flatMap(({ upsells: t }) => t ? t.map((e) => e.productGID) : []).filter((t) => t != null), _e = (i) => i.dealBars.filter((t) => t.dealBarType === "bundle").flatMap(
  ({ bundleProducts: t }) => t ? t.map((e) => e.productGID) : []
).filter((t) => t != null).filter((t) => t !== "default"), ye = (i) => !i.checkboxUpsellsEnabled || !i.checkboxUpsells ? [] : i.checkboxUpsells.upsells.map((t) => t.productGID).filter((t) => t != null), be = (i) => i.dealBars.filter((t) => t.dealBarType === "sku").flatMap(({ productGID: t }) => t ? [t] : []);
class N {
  constructor(t, e) {
    this.storefrontApiVersion = "2025-10", this.storefrontAccessToken = e, this.shopifyDomain = t;
  }
  async query(t, e) {
    var s, l;
    const n = (s = e == null ? void 0 : e.variables) != null ? s : {};
    let r = `https://${this.shopifyDomain}/api/${this.storefrontApiVersion}/graphql.json`;
    const a = (l = t.match(/query\s+(\w+)/)) == null ? void 0 : l[1];
    a && (r += `?operation_name=${a}`);
    const o = await (await fetch(r, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": this.storefrontAccessToken
      },
      body: JSON.stringify({
        query: t,
        variables: n
      })
    })).text();
    if (!o)
      throw new Error("Empty graphql response");
    return JSON.parse(o).data;
  }
}
class Tt extends Error {
  constructor(t) {
    super(t), this.name = "CartFetchError";
  }
}
const st = "kaching_session_id", ke = async () => {
  try {
    Ce();
    const i = R();
    await Se() !== i && await Pe(i);
  } catch (i) {
    if (i instanceof Tt)
      console.error(i);
    else
      throw i;
  }
}, Ce = () => {
  const i = new URL(window.location.href), t = new URLSearchParams(i.search), e = t.get("preview_kaching_session_id");
  e && (G.setItem(st, e), t.delete("preview_kaching_session_id"), i.search = t.toString(), window.history.replaceState({}, "", i.toString()));
}, R = () => G.getItem(st) || Ie(), Ie = () => {
  const i = we();
  return G.setItem(st, i), i;
}, we = () => typeof crypto != "undefined" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : ve(), ve = () => "10000000-1000-4000-8000-100000000000".replace(
  /[018]/g,
  (i) => (+i ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +i / 4).toString(16)
), Se = async () => {
  const i = await fetch(W("cart.js"));
  if (!i.ok)
    throw new Tt("Failed to fetch cart");
  return (await i.json()).attributes._kaching_session_id;
}, Pe = async (i) => await fetch(W("cart/update.js"), {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    attributes: {
      _kaching_session_id: i
    }
  })
}), At = (i, t) => {
  const e = i.slice(-1);
  return parseInt(e, 16) % t + 1;
};
let $, V = null, Dt, Et = [];
const Te = async (i) => {
  Et = i;
}, Bt = async () => {
  if (V)
    return V;
  V = (async () => {
    if (!$.storefrontAccessToken)
      return;
    const i = new N(
      $.shopifyDomain,
      $.storefrontAccessToken
    );
    Dt = await St(i, {
      useExternalMetafieldNamespace: !1
    });
  })();
  try {
    await V;
  } catch (i) {
    throw V = null, i;
  }
}, Ae = async () => {
  var e;
  await Bt();
  const i = Dt.filter((n) => {
    if (!n.abTestVariantId)
      return !0;
    const r = R(), a = At(
      r,
      n.abTestVariantsCount
    );
    return n.abTestVariantNumber === a;
  }), t = (e = Et.find(
    (n) => n.locale === $.locale
  )) == null ? void 0 : e.translations;
  return i.map((n) => {
    const r = (t == null ? void 0 : t.dealBlocks[n.id]) || {};
    return De(n, r);
  });
}, De = (i, t) => {
  var I, m, g;
  const e = (u) => {
    switch (u.dealBarType) {
      case void 0:
      case "quantity-break":
        return n(u);
      case "bxgy":
        return r(u);
      case "bundle":
        return a(u);
      case "subscription":
        return o(u);
      case "sku":
        return s(u);
      default:
        return null;
    }
  }, n = (u) => ({
    id: u.id,
    title: t[u.title] || u.title,
    mediaImageGID: u.mediaImageGID,
    freeGifts: [
      ...c(u.freeGifts),
      ...d(u.id, i.progressiveGifts)
    ],
    upsells: h(u.upsells),
    dealBarType: "quantity-break",
    quantity: Number(u.quantity),
    discount: it(u.discountType, u.discountValue)
  }), r = (u) => ({
    id: u.id,
    title: t[u.title] || u.title,
    mediaImageGID: u.mediaImageGID,
    freeGifts: c(u.freeGifts),
    upsells: h(u.upsells),
    dealBarType: "bxgy",
    buyQuantity: Number(u.buyQuantity),
    getQuantity: Number(u.getQuantity)
  }), a = (u) => ({
    id: u.id,
    title: t[u.title] || u.title,
    mediaImageGID: u.mediaImageGID,
    freeGifts: c(u.freeGifts),
    upsells: h(u.upsells),
    dealBarType: "bundle",
    bundleProducts: l(u.bundleProducts)
  }), o = (u) => ({
    id: u.id,
    title: t[u.title] || u.title,
    mediaImageGID: u.mediaImageGID,
    freeGifts: c(u.freeGifts),
    upsells: [],
    dealBarType: "subscription"
  }), s = (u) => ({
    id: u.id,
    title: t[u.title] || u.title,
    mediaImageGID: u.mediaImageGID,
    freeGifts: c(u.freeGifts),
    upsells: h(u.upsells),
    dealBarType: "sku"
  }), l = (u) => u.map((f) => ({
    id: f.id,
    productId: f.productGID === "default" ? "default" : B(f.productGID),
    variantId: f.variantGID ? B(f.variantGID) : null,
    quantity: Number(f.quantity),
    discount: it(
      f.discountType,
      f.discountValue
    )
  })), c = (u) => u ? u.filter((w) => w.productGID).map((w) => {
    var A, y;
    return {
      id: w.id,
      productId: B(w.productGID),
      variantId: w.variantGIDs && ((A = w.variantGIDs) != null && A[0]) ? B(w.variantGIDs[0]) : null,
      variantIds: w.variantGIDs ? w.variantGIDs.map(B) : null,
      quantity: Number(w.quantity),
      applyOnlyForSubscriptions: (y = w.applyOnlyForSubscriptions) != null ? y : !1
    };
  }) : [], d = (u, f) => {
    if (!f)
      return [];
    const w = i.dealBars.findIndex((_) => _.id === u);
    return f.gifts.filter((_) => _.giftType === "product").filter((_) => _.productGID).filter(
      (_) => w + 1 >= _.unlockAtBar
    ).map((_) => ({
      id: _.id,
      productId: B(_.productGID),
      variantId: null,
      variantIds: null,
      quantity: 1,
      applyOnlyForSubscriptions: !1
    }));
  }, h = (u) => u ? u.map((f) => ({
    id: f.id,
    productId: f.productGID ? B(f.productGID) : null,
    variantId: f.variantGIDs && f.variantGIDs[0] ? B(f.variantGIDs[0]) : null,
    variantIds: f.variantGIDs ? f.variantGIDs.map(B) : null,
    quantity: Number(f.quantity),
    discount: it(f.discountType, f.discountValue)
  })) : [];
  return {
    id: i.id,
    nanoId: i.nanoId,
    collectionBreaksEnabled: (I = i.collectionBreaksEnabled) != null ? I : !1,
    differentVariantsEnabled: i.differentVariantsEnabled,
    marketId: (m = i.marketId) != null ? m : null,
    currency: (g = i.currency) != null ? g : null,
    dealBars: i.dealBars.filter((u) => "showAsSoldOutEnabled" in u ? !u.showAsSoldOutEnabled : !0).map(e).filter((u) => u !== null)
  };
}, it = (i, t) => !i || i === "default" ? null : {
  type: i,
  value: Number(t)
}, B = (i) => Number(i.split("/").pop()), Ee = (i) => ($ = i, {
  fetchDeals: Ae
});
function ht(i) {
  const t = i.properties && typeof i.properties == "object" ? i.properties : {};
  ot(t);
  const e = {
    id: Number(i.id),
    quantity: Number(i.quantity) || 1,
    properties: t
  };
  return i.selling_plan && (e.selling_plan = Number(i.selling_plan)), i.parent_id && (e.parent_id = Number(i.parent_id)), e;
}
function ot(i) {
  if (!i.__kaching_bundles) return;
  const t = i.__kaching_bundles;
  if (typeof t == "string")
    try {
      const e = atob(t);
      JSON.parse(e), i.__kaching_bundles = e;
    } catch {
    }
}
function ft(i) {
  try {
    return JSON.parse(i), !1;
  } catch {
    return !0;
  }
}
function mt(i) {
  const t = new URLSearchParams(i), e = new FormData();
  return t.forEach((n, r) => {
    e.append(r, n);
  }), e;
}
function Be(i) {
  const t = new URLSearchParams();
  return i.forEach((e, n) => {
    t.append(n, e);
  }), t.toString();
}
function gt(i) {
  return Array.from(i.keys()).some(
    (e) => e.startsWith("items[")
  ) ? Ne(i) : qe(i);
}
function qe(i) {
  const t = i.get("id");
  if (!t)
    return C("intercept_cart_request_error", {
      type: "processing",
      error: "Missing item id in form data",
      body: i
    }), null;
  const e = {};
  i.forEach((o, s) => {
    const l = s.match(/^properties\[(.+)\]$/);
    l && (e[l[1]] = o);
  }), ot(e);
  const n = {
    id: Number(t),
    quantity: Number(i.get("quantity")) || 1,
    properties: e
  }, r = i.get("selling_plan");
  r && (n.selling_plan = Number(r));
  const a = i.get("parent_id");
  return a && (n.parent_id = Number(a)), [n];
}
function Ne(i) {
  const t = /* @__PURE__ */ new Map();
  if (i.forEach((n, r) => {
    const a = r.match(/^items\[(\d+)\]\[(.+)\]$/);
    if (!a) return;
    const o = Number(a[1]), s = a[2];
    t.has(o) || t.set(o, { properties: {} });
    const l = t.get(o);
    switch (s) {
      case "id":
        l.id = Number(n);
        break;
      case "quantity":
        l.quantity = Number(n);
        break;
      case "selling_plan":
        l.selling_plan = Number(n);
        break;
      case "parent_id":
        l.parent_id = Number(n);
        break;
      default: {
        const c = s.match(/^properties\]\[(.+)$/);
        c && (l.properties[c[1]] = n);
      }
    }
  }), t.size === 0) return null;
  const e = [];
  for (const [, n] of t) {
    if (!n.id) continue;
    ot(n.properties);
    const r = {
      id: n.id,
      quantity: n.quantity || 1,
      properties: n.properties
    };
    n.selling_plan && (r.selling_plan = n.selling_plan), n.parent_id && (r.parent_id = n.parent_id), e.push(r);
  }
  return e.length > 0 ? e : null;
}
function _t(i, t) {
  const e = new FormData();
  if (i.forEach((n, r) => {
    Fe(r) || e.append(r, n);
  }), t.length === 1) {
    const n = t[0];
    if (e.append("id", String(n.id)), e.append("quantity", String(n.quantity)), n.selling_plan && e.append("selling_plan", String(n.selling_plan)), n.parent_id && e.append("parent_id", String(n.parent_id)), n.properties)
      for (const [r, a] of Object.entries(n.properties))
        e.append(`properties[${r}]`, String(a));
  } else
    t.forEach(
      (n, r) => Oe(e, n, r)
    );
  return e;
}
function Fe(i) {
  return ["id", "quantity", "selling_plan", "parent_id"].includes(i) || i.startsWith("properties[") || i.startsWith("items[");
}
function Oe(i, t, e) {
  if (i.append(`items[${e}][id]`, String(t.id)), i.append(`items[${e}][quantity]`, String(t.quantity)), t.selling_plan && i.append(`items[${e}][selling_plan]`, String(t.selling_plan)), t.parent_id && i.append(`items[${e}][parent_id]`, String(t.parent_id)), t.properties)
    for (const [n, r] of Object.entries(t.properties))
      i.append(`items[${e}][properties][${n}]`, String(r));
}
function Ve(i) {
  try {
    const t = JSON.parse(i);
    return !t || typeof t != "object" ? (C("intercept_cart_request_error", {
      type: "processing",
      error: "Failed to parse JSON body",
      body: i
    }), null) : Array.isArray(t.items) ? t.items.filter(
      (e) => e && typeof e == "object" && "id" in e
    ).map((e) => ht(e)) : t.id ? [ht(t)] : null;
  } catch {
    return C("intercept_cart_request_error", {
      type: "processing",
      error: "Failed to parse JSON body",
      body: i
    }), null;
  }
}
function Me(i, t) {
  try {
    const e = JSON.parse(i), n = [
      "id",
      "quantity",
      "selling_plan",
      "parent_id",
      "properties"
    ], r = {};
    for (const [a, o] of Object.entries(e))
      !n.includes(a) && a !== "items" && (r[a] = o);
    return t.length === 1 ? Object.assign(r, t[0]) : r.items = t, JSON.stringify(r);
  } catch {
    return t.length === 1 ? JSON.stringify(t[0]) : JSON.stringify({ items: t });
  }
}
const yt = /* @__PURE__ */ new WeakMap();
class $e {
  constructor() {
    this._started = !1, this._registeredDeals = /* @__PURE__ */ new Map(), this._fallbackDeal = null, this._fallbackDealTimeout = null;
  }
  start() {
    this._started || (this._started = !0, this._interceptFetchRequests(), this._interceptXHRRequests(), this._interceptCartFormSubmits(), window.OpusNoATC = !0, p("CartInterceptor started"));
  }
  registerDeal(t, e, n) {
    const r = this._registeredDeals.get(t) || [];
    r.push({ getItems: n, product: e }), this._registeredDeals.set(t, r), p("CartInterceptor deal registered", {
      dealId: t,
      totalDeals: r.length
    });
  }
  setFallbackDeal(t, e) {
    p("CartInterceptor fallback deal set", { dealId: t }), this._fallbackDealTimeout && clearTimeout(this._fallbackDealTimeout), this._fallbackDeal = { dealId: t, product: e }, this._fallbackDealTimeout = window.setTimeout(() => {
      this._fallbackDeal = null, this._fallbackDealTimeout = null;
    }, 2e3);
  }
  _interceptFetchRequests() {
    const t = window.fetch.bind(window);
    window.fetch = async (e, n) => {
      var a, o;
      const r = this._getModifiedBody(e, n == null ? void 0 : n.body);
      if (r) {
        v("Intercepting cart/add request, merging bundle items"), C(
          "intercept_cart_request",
          {
            type: "fetch",
            theme: (a = window.Shopify.theme) == null ? void 0 : a.schema_name
          },
          0.01
        );
        try {
          return await t(e, { ...n, body: r });
        } catch (s) {
          return p("Modified request failed, retrying with original", { error: s }), C("intercept_cart_request_error", {
            type: "fetch",
            theme: (o = window.Shopify.theme) == null ? void 0 : o.schema_name,
            error: s instanceof Error ? s.message : String(s)
          }), t(e, n);
        }
      }
      return t(e, n);
    };
  }
  _interceptXHRRequests() {
    const t = XMLHttpRequest.prototype.open, e = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(n, r, a = !0, o, s) {
      return yt.set(this, r), t.call(this, n, r, a, o, s);
    }, XMLHttpRequest.prototype.send = function(n) {
      var a, o;
      const r = yt.get(this);
      if (r) {
        const s = j._getModifiedBody(r, n);
        if (s) {
          v("Intercepting XHR cart/add request, merging bundle items"), C("intercept_cart_request", {
            type: "xhr",
            theme: (a = window.Shopify.theme) == null ? void 0 : a.schema_name
          });
          try {
            return e.call(this, s);
          } catch (l) {
            return p("Modified XHR request failed, retrying with original", {
              error: l
            }), C("intercept_cart_request_error", {
              type: "xhr",
              theme: (o = window.Shopify.theme) == null ? void 0 : o.schema_name,
              error: l instanceof Error ? l.message : String(l)
            }), e.call(this, n);
          }
        }
      }
      return e.call(this, n);
    };
  }
  _interceptCartFormSubmits() {
    const t = async (e) => {
      var s, l;
      if (e.defaultPrevented || !(e.target instanceof HTMLFormElement))
        return;
      const n = e.target, r = n.action;
      if (!r.includes("/cart/add"))
        return;
      const a = new FormData(n);
      if (this._getModifiedBody(r, a)) {
        e.preventDefault(), C("intercept_cart_request", {
          type: "form",
          theme: (s = window.Shopify.theme) == null ? void 0 : s.schema_name
        });
        try {
          const c = await fetch(r, {
            method: "POST",
            body: a
          });
          if (!c.ok)
            throw new Error(`HTTP ${c.status}`);
          window.location.href = "/cart";
        } catch (c) {
          p("Fetch request failed, submitting original form", {
            error: c
          }), C("intercept_cart_request_error", {
            type: "form",
            theme: (l = window.Shopify.theme) == null ? void 0 : l.schema_name,
            error: c instanceof Error ? c.message : String(c)
          }), n.submit();
        }
      }
    };
    document.addEventListener("submit", t), setTimeout(() => {
      document.removeEventListener("submit", t), document.addEventListener("submit", t);
    }, 3e3);
  }
  _getModifiedBody(t, e) {
    try {
      const n = typeof t == "string" ? t : t instanceof URL ? t.href : t.url;
      if (!this._isInterceptableUrl(n))
        return null;
      if (p("Request body", e), typeof e != "string" && !(e instanceof FormData))
        return C("intercept_cart_request_error", {
          type: "processing",
          error: "Invalid body type"
        }), null;
      const r = this._parseOriginalItems(e);
      if (p("Original items", r), !r)
        return null;
      const a = this._findBundleItems(r);
      if (p("Bundle items", a), !a)
        return null;
      const o = this._mergeItems(r, a);
      if (p("Merged items", o), JSON.stringify(r) === JSON.stringify(o))
        return null;
      const s = this._updateBody(e, o);
      return p("Updated body", s), s;
    } catch (n) {
      return p("CartInterceptor error, falling back to original request", {
        error: n
      }), C("intercept_cart_request_error", {
        type: "processing",
        error: n instanceof Error ? n.message : String(n)
      }), null;
    }
  }
  _isInterceptableUrl(t) {
    return t.includes("cart/add") && !t.includes("kaching_bundles=true") && !t.includes("kaching-cart=true");
  }
  _parseOriginalItems(t) {
    if (t instanceof FormData)
      return gt(t);
    if (ft(t)) {
      const e = mt(t);
      return gt(e);
    }
    return Ve(t);
  }
  _findBundleItems(t) {
    var o, s;
    const e = t.find(
      (l) => l.properties.__kaching_bundles
    ), n = e ? JSON.parse(e.properties.__kaching_bundles).deal : (o = this._fallbackDeal) == null ? void 0 : o.dealId;
    if (!n)
      return null;
    const r = this._fallbackDeal;
    if (!e && r) {
      if (!t.some(
        (c) => r.product.variants.some((d) => d.id === c.id)
      ))
        return null;
      C("fallback_deal_used", {
        theme: (s = window.Shopify.theme) == null ? void 0 : s.schema_name
      });
    }
    const a = this._registeredDeals.get(n);
    if (!(a != null && a.length))
      return p("No registered deals found", { dealId: n }), null;
    for (const { getItems: l, product: c } of a) {
      const d = l();
      if (e ? d.some(
        (b) => t.some(
          (I) => I.id === b.id && I.properties.__kaching_bundles === b.properties.__kaching_bundles
        )
      ) : d.length > 0 && c.id === (r == null ? void 0 : r.product.id)) return d;
    }
    return p("No matching items found for deal", { dealId: n }), null;
  }
  _mergeItems(t, e) {
    t = t.map((s) => ({
      ...s
    }));
    const n = t.find(
      (s) => s.properties.__kaching_bundles
    );
    if (!n && this._fallbackDeal) {
      const s = t.filter(
        (l) => !this._fallbackDeal.product.variants.some((c) => c.id === l.id) && !e.some((c) => c.id === l.id)
      );
      return [...e, ...s];
    }
    const r = {};
    if (n) {
      for (const [l, c] of Object.entries(n.properties))
        l !== "__kaching_bundles" && (r[l] = c);
      const s = e.find(
        (l) => l.id === n.id && l.properties.__kaching_bundles === n.properties.__kaching_bundles
      );
      s && (n.quantity = s.quantity, s.selling_plan && (n.selling_plan = s.selling_plan));
    }
    return [...e.filter(
      (s) => !t.some(
        (l) => l.id === s.id && l.properties.__kaching_bundles === s.properties.__kaching_bundles
      )
    ).map((s) => {
      const l = JSON.parse(
        s.properties.__kaching_bundles
      );
      return l != null && l.main ? {
        ...s,
        properties: {
          ...r,
          ...s.properties
        }
      } : s;
    }), ...t];
  }
  _updateBody(t, e) {
    if (t instanceof FormData)
      return _t(t, e);
    if (ft(t)) {
      const n = mt(t), r = _t(n, e);
      return Be(r);
    }
    return Me(t, e);
  }
}
const j = new $e(), H = async (i, t, e, n) => {
  var l;
  if (!t || e.length === 0) return;
  const r = xe(n);
  if (r.length === 0) return;
  const a = e.map((c) => c.id), o = (l = r.find((c) => c.localization)) == null ? void 0 : l.localization, s = new N(
    i,
    t
  );
  try {
    const c = await ne(
      s,
      a,
      o
    );
    for (const d of e) {
      const h = c.find(
        (b) => b.id === d.id
      );
      h && Ge(d, h);
    }
  } catch (c) {
    console.error("[Kaching Bundles] Failed to fetch swatches", c), setTimeout(() => {
      throw c;
    }, 0);
  }
}, xe = (i) => i.map((e) => e.swatchOptions || []).reduce((e, n) => e.concat(n), []).filter((e) => e != null).filter((e) => e.swatchType !== "default"), Ge = (i, t) => {
  for (const e of t.options) {
    const n = i.options.find(
      (r) => r.position === e.position
    );
    if (n) {
      n.defaultName = e.defaultName;
      for (const r of e.optionValues) {
        const a = n.optionValues.find(
          (o) => o.id === r.id
        );
        a && (a.defaultName = r.defaultName);
      }
    }
  }
}, bt = (i, t, e) => {
  if (p("_updateNativePrice", {
    discountedPrice: i,
    fullPrice: t
  }), t.amount > 0) {
    let n = k(
      "[data-kaching-price-compare]"
    );
    if (e.customSelectors.priceCompare && (n = k(
      e.customSelectors.priceCompare
    )), n.length > 0)
      for (const r of n)
        t.amount > i.amount ? (r.innerHTML = t.formatted, r.style.display = "") : r.style.display = "none";
    else {
      const r = [
        ".price--large .price__sale .price-item--regular",
        // Dawn, Shrine
        ".price--medium .price__sale .price-item--regular",
        // Be Yours
        ".lumin-price .price__sale .price-item--regular",
        // Architect, Beauty
        ".product-page-price .price__sale .price-item--regular",
        // Craft, Atlas
        ".f-price--large .f-price__sale .f-price-item--regular",
        // Sleek
        'gp-product-price div[type="compare"]',
        // Gempages
        "gp-product-price .gp-product-compare-price",
        // Gempages
        "product-price .compare-at-price",
        // Horizon
        ".pp-product-price .pp-price-item--sale",
        // Page Pilot
        ".product__price-and-badge .product__price--compare",
        // Palo Alto
        ".product-block--price span[data-compare-price]",
        // Impulse
        ".main-product__block-price .m-price__sale .m-price-item--regular",
        // Minimog
        ".product-info__price compare-at-price",
        // Impact
        '.product-info__block-item[data-block-type="price"] compare-at-price',
        // Prestige
        ".product-form__info-item .price--compare",
        // Warehouse
        '[data-product-type="compare_at_price"]',
        // PageFly
        ".product__price-wrapper .price__container .price__sale del",
        // Marble
        ".product__price-wrapper .price__container .product__price span:not(.visually-hidden)"
        // Marble
      ].flatMap((a) => k(a));
      for (const a of r)
        a.innerHTML = t.formatted;
    }
  }
  if (i.amount > 0) {
    let n = k("[data-kaching-price]");
    if (e.customSelectors.price && (n = k(
      e.customSelectors.price
    )), n.length > 0)
      for (const r of n)
        r.innerHTML = i.formatted;
    else {
      const r = [
        ".price--large .price__regular .price-item--regular",
        // Dawn, Shrine
        ".price--large .price__sale .price-item--sale",
        // Dawn, Shrine
        ".price--medium .price__regular .price-item--regular",
        // Be Yours
        ".price--medium .price__sale .price-item--sale",
        // Be Yours
        ".lumin-price .price__regular .price-item--regular",
        // Architect, Beauty
        ".lumin-price .price__sale .price-item--sale",
        // Architect, Beauty
        ".product-page-price .price__regular .price-item--regular",
        // Craft, Atlas
        ".product-page-price .price__sale .price-item--sale",
        // Craft, Atlas
        ".f-price--large .f-price__regular .f-price-item--regular",
        // Sleek
        ".f-price--large .f-price__sale .f-price-item--sale",
        // Sleek
        'gp-product-price div[type="regular"]',
        // Gempages
        "gp-product-price .gp-price:not(.gp-product-compare-price)",
        // Gempages
        "product-price .price",
        // Horizon
        ".pp-product-price .pp-price-item--regular",
        // Page Pilot
        ".product__price-and-badge .product__price--regular",
        // Palo Alto
        ".product-block--price span[data-product-price]",
        // Impulse
        ".main-product__block-price .m-price__sale .m-price-item--sale",
        // Minimog
        ".product-info__price sale-price",
        // Impact
        '.product-info__block-item[data-block-type="price"] sale-price',
        // Prestige
        ".product-form__info-item .price:not(.price--compare)",
        // Warehouse
        '[data-product-type="price"]',
        // PageFly
        ".product__price-wrapper .price__container .price__sale ins"
        // Marble
      ].flatMap((a) => k(a));
      for (const a of r)
        a.innerHTML = i.formatted;
    }
  }
  if (i.amount > 0 && t.amount > 0) {
    const n = Math.round(
      (t.amount - i.amount) / t.amount * 100
    ), r = k("[data-kaching-price-badge]");
    if (r.length > 0)
      for (const a of r)
        n > 0 ? (a.innerHTML = a.innerHTML.replace(
          /\d+%/,
          `${n}%`
        ), a.style.display = "") : a.style.display = "none";
    else {
      const a = [
        ".price--large .price__badge-sale",
        // Dawn, Shrine
        ".lumin-price .price__badge-sale",
        // Architect
        ".product-page-price .price__badge-sale",
        // Craft, Atlas
        "gp-product-tag div[data-gp-text]",
        // Gempages
        ".product__price-and-badge span[data-price-off-amount]",
        // Palo Alto
        ".product-block--price span[data-save-price]",
        // Impulse
        ".product-info__price on-sale-badge"
        // Impact
      ].flatMap((o) => k(o));
      for (const o of a) {
        if (/\d/.test(o.innerHTML) && !o.innerHTML.includes("%")) {
          o.style.display = "none";
          continue;
        }
        o.innerHTML = o.innerHTML.replace(/\d+%/, `${n}%`);
      }
    }
  }
}, kt = window;
class Le {
  constructor(t, e, n, r, a, o, s) {
    var l, c, d, h;
    if (this._items = [], this._clickedAddToCartBeforeFormSubmit = !1, this._isFirstVariantChange = !0, v("Deal block id:", a.id), v("Deal block settings", a), v("Config", n), v("Product", o), v("Deal block widget", { widget: t }), v("Cart form", { form: (l = e.addToCartForm()) == null ? void 0 : l.form }), v("Add to cart button", {
      button: (c = e.addToCartButton()) == null ? void 0 : c.button
    }), v("Quantity input", { input: e.quantityInput() }), v("Variant picker", {
      picker: (d = e.variantPicker()) == null ? void 0 : d.elements()
    }), this._dealBlockElement = t, this._productBlock = e, this._globalConfig = n, this._translations = r, this._dealBlockSettings = a, this._product = o, this._otherProductsFromLiquid = s, this._subscriptionsEnabled = !!a.subscriptionsEnabled || a.dealBars.some((b) => b.dealBarType === "subscription"), this._country = this._globalConfig.country, this._language = this._globalConfig.locale.split("-")[0].toUpperCase(), this._globalConfig.featureFlags.initialize_with_form_variant) {
      let b = this._product.selectedVariantId || this._product.variants[0].id;
      const I = (h = this._productBlock.addToCartForm()) == null ? void 0 : h.currentVariantId();
      I && this._product.variants.some((m) => m.id == I) && (b = I), this._currentVariantId = b;
    } else
      this._currentVariantId = this._product.selectedVariantId || this._product.variants[0].id;
    this._initialize();
  }
  _initialize() {
    P(
      this._dealBlockElement,
      "deal-block-id",
      this._dealBlockSettings.id
    ), P(
      this._dealBlockElement,
      "config",
      JSON.stringify(this._globalConfig)
    ), P(
      this._dealBlockElement,
      "translations",
      JSON.stringify(this._translations)
    ), P(
      this._dealBlockElement,
      "deal-block",
      JSON.stringify(this._dealBlockSettings)
    ), P(
      this._dealBlockElement,
      "product",
      JSON.stringify(this._product)
    ), P(
      this._dealBlockElement,
      "current-variant-id",
      String(this._currentVariantId)
    ), P(
      this._dealBlockElement,
      "other-products",
      JSON.stringify(this._otherProductsFromLiquid)
    ), this._loadMediaImagesAsync(), this._loadOtherProductsAsync(), this._loadCollectionBreaksProductsAsync(), this._loadComplementaryProductsAsync(), this._loadNativeBundleProductIdsAsync(), this._subscriptionsEnabled && (window.kachingSubscriptionsHidden = !0);
    const t = !!this._productBlock.addToCartForm(), e = !t && this._globalConfig.featureFlags.intercept_cart_request === !0 && !!this._globalConfig.customSelectors.addToCartButton;
    !t && !e || this._addEventListeners(e);
  }
  async _loadMediaImagesAsync() {
    if (!this._globalConfig.storefrontAccessToken)
      return;
    const t = new N(
      this._globalConfig.shopifyDomain,
      this._globalConfig.storefrontAccessToken
    ), e = ae(this._dealBlockSettings), n = await Wt(t, e, 300);
    P(
      this._dealBlockElement,
      "media-images",
      JSON.stringify(n)
    );
  }
  async _loadOtherProductsAsync() {
    if (!this._globalConfig.storefrontAccessToken)
      return;
    const t = he(this._dealBlockSettings);
    if (!t.length)
      return;
    const e = new N(
      this._globalConfig.shopifyDomain,
      this._globalConfig.storefrontAccessToken
    ), n = await z(e, {
      country: this._country,
      language: this._language,
      productIds: t,
      includeSellingPlans: this._globalConfig.accessScopes.includes(
        "unauthenticated_read_selling_plans"
      ),
      includeAvailableQuantity: this._globalConfig.accessScopes.includes(
        "unauthenticated_read_product_inventory"
      ),
      useExternalMetafieldNamespace: !1
    });
    await H(
      this._globalConfig.shopifyDomain,
      this._globalConfig.storefrontAccessToken,
      n,
      [this._dealBlockSettings]
    ), P(
      this._dealBlockElement,
      "other-products",
      JSON.stringify(n)
    );
  }
  async _loadCollectionBreaksProductsAsync() {
    if (!this._globalConfig.storefrontAccessToken)
      return;
    const { collectionBreaksEnabled: t, collectionBreaks: e } = this._dealBlockSettings;
    if (!t || !e)
      return;
    const n = (e.excludedProducts || []).map(
      ({ id: h }) => h
    ), r = (e.selectedProducts || []).map(
      ({ id: h }) => h
    ), a = (e.selectedCollections || []).map(({ id: h }) => h), o = new N(
      this._globalConfig.shopifyDomain,
      this._globalConfig.storefrontAccessToken
    );
    let s = await Yt(o, {
      country: this._country,
      language: this._language,
      blockVisibility: e.visibility,
      excludedProductGIDs: n,
      selectedProductGIDs: r,
      selectedCollectionGIDs: a
    });
    s = s.slice(0, 250);
    const l = zt(s, 50);
    let d = (await Promise.all(
      l.map(
        (h) => z(o, {
          country: this._country,
          language: this._language,
          productIds: h.map((b) => Number(b.split("/").pop())),
          includeSellingPlans: this._globalConfig.accessScopes.includes(
            "unauthenticated_read_selling_plans"
          ),
          includeAvailableQuantity: this._globalConfig.accessScopes.includes(
            "unauthenticated_read_product_inventory"
          ),
          useExternalMetafieldNamespace: !1
        })
      )
    )).flat();
    d = d.filter(
      (h) => h.availableForSale
    ), d.sort((h, b) => h.id === this._product.id ? -1 : b.id === this._product.id ? 1 : 0), await H(
      this._globalConfig.shopifyDomain,
      this._globalConfig.storefrontAccessToken,
      d,
      [this._dealBlockSettings]
    ), P(
      this._dealBlockElement,
      "collection-breaks-products",
      JSON.stringify(d)
    ), setTimeout(() => {
      this._preloadImages(d);
    }, 1e3);
  }
  async _loadComplementaryProductsAsync() {
    if (!this._dealBlockSettings.dealBars.some(
      (a) => {
        var o;
        return (o = a.upsells) == null ? void 0 : o.some(
          (s) => s.productSource === "complementary"
        );
      }
    ) || !this._globalConfig.storefrontAccessToken)
      return;
    const e = new N(
      this._globalConfig.shopifyDomain,
      this._globalConfig.storefrontAccessToken
    ), n = await Kt(
      e,
      {
        country: this._country,
        language: this._language,
        productId: this._product.id
      }
    );
    if (!n.length)
      return;
    let r = await z(e, {
      country: this._country,
      language: this._language,
      productIds: n.map(
        (a) => Number(a.split("/").pop())
      ),
      includeSellingPlans: this._globalConfig.accessScopes.includes(
        "unauthenticated_read_selling_plans"
      ),
      includeAvailableQuantity: this._globalConfig.accessScopes.includes(
        "unauthenticated_read_product_inventory"
      ),
      useExternalMetafieldNamespace: !1
    });
    r = r.filter(
      (a) => a.availableForSale
    ), await H(
      this._globalConfig.shopifyDomain,
      this._globalConfig.storefrontAccessToken,
      r,
      [this._dealBlockSettings]
    ), P(
      this._dealBlockElement,
      "complementary-products",
      JSON.stringify(r)
    );
  }
  async _loadNativeBundleProductIdsAsync() {
    if (!this._globalConfig.storefrontAccessToken)
      return;
    const t = [
      this._product,
      ...this._otherProductsFromLiquid
    ].filter((r) => r.isNativeBundle === null);
    if (t.length === 0)
      return;
    const e = new N(
      this._globalConfig.shopifyDomain,
      this._globalConfig.storefrontAccessToken
    ), n = await Xt(
      e,
      t.map((r) => r.id)
    );
    n.length > 0 && P(
      this._dealBlockElement,
      "native-bundle-product-ids",
      JSON.stringify(n)
    );
  }
  _preloadImages(t) {
    for (const e of t) {
      const n = e.variants[0].image || e.image;
      if (n) {
        const r = new Image();
        r.src = n;
      }
    }
  }
  _addEventListeners(t) {
    if (this._listenForVariantUrlChange(), this._listenForQuantityInputChange(), this._listenForBlockVariantSelect(), this._listenForBlockVariantsChange(), t || (this._listenForFormVariantIdChange(), this._listenForFormSellingPlanChange()), !window.kachingBundlesDisableAddToCartHandling) {
      if (this._globalConfig.featureFlags.intercept_cart_request) {
        j.start();
        const e = this._dealBlockSettings.nanoId || this._dealBlockSettings.id;
        j.registerDeal(e, this._product, () => this._items);
      }
      this._listenForAddToCartClick();
    }
  }
  /* Native variant change handling */
  _listenForVariantUrlChange() {
    Lt(), F(kt, "locationchange", () => {
      const e = new URLSearchParams(kt.location.search).get("variant");
      e && (p("listenForVariantUrlChange", e), this._handleNativeVariantChange(Number(e)));
    });
  }
  _listenForFormVariantIdChange() {
    const t = this._productBlock.addToCartForm();
    t && t.onVariantIdChange((e) => {
      p("listenForFormVariantIdChange", e), this._handleNativeVariantChange(e);
    });
  }
  _handleNativeVariantChange(t) {
    if (p("handleNativeVariantChange", {
      variantId: t,
      currentVariantId: this._currentVariantId
    }), t != this._currentVariantId && this._product.variants.find((e) => e.id == t)) {
      if (this._globalConfig.featureFlags.remove_variant_change_delay ? window.kachingBundlesCurrentVariantChangeInProgress || (this._currentVariantId = t) : this._currentVariantId = t, this._globalConfig.featureFlags.remove_variant_change_delay) {
        if (window.kachingBundlesCurrentVariantChangeInProgress) {
          p("handleNativeVariantChange", "skipping");
          return;
        }
      } else if (this._dealBlockElement.dataset.nativeVariantChangeInProgress || window.kachingBundlesCurrentVariantChangeInProgress) {
        p("handleNativeVariantChange", "skipping");
        return;
      }
      this._dealBlockElement.dataset.nativeVariantChangeInProgress = "true", setTimeout(
        () => {
          delete this._dealBlockElement.dataset.nativeVariantChangeInProgress;
        },
        this._globalConfig.featureFlags.remove_variant_change_delay ? 1e3 : 500
      ), P(
        this._dealBlockElement,
        "current-variant-id",
        String(t)
      );
    }
  }
  _listenForFormSellingPlanChange() {
    if (!this._globalConfig.featureFlags.observe_form_selling_plan)
      return;
    const t = this._productBlock.addToCartForm();
    t && t.onSellingPlanChange((e) => {
      p("listenForFormSellingPlanChange", e), P(
        this._dealBlockElement,
        "selling-plan-id",
        e ? String(e) : ""
      );
    });
  }
  /* Native quantity input */
  _listenForQuantityInputChange() {
    this._productBlock.onQuantityInputChange((t) => {
      if (p("_listenForQuantityInputChange", t), !window.kachingBundlesQuantityChangeInProgress) {
        if (!this._globalConfig.keepQuantityInput || window.kachingBundlesCurrentVariantChangeInProgress || this._dealBlockElement.dataset.nativeVariantChangeInProgress) {
          this._changeQuantityInput();
          return;
        }
        this._globalConfig.keepQuantityInput && P(this._dealBlockElement, "quantity", String(t));
      }
    });
  }
  _changeQuantityInput() {
    const t = this._productBlock.quantityInput();
    if (!t || this._items.length === 0 || window.kachingBundlesDisableAddToCartHandling && !this._globalConfig.keepQuantityInput)
      return;
    window.kachingBundlesQuantityChangeInProgress = !0;
    const e = this._items.filter(
      (a) => this._isMainProductItem(a)
    ), r = (e.find(({ id: a }) => a == this._currentVariantId) || e[0]).quantity;
    p("_updateQuantityInput", r), t.value = String(r), this._globalConfig.shopifyDomain === "119a01-bf.myshopify.com" && t.dispatchEvent(new Event("input", { bubbles: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0 })), setTimeout(() => {
      delete window.kachingBundlesQuantityChangeInProgress;
    }, 100);
  }
  /* Block variants change handling */
  _listenForBlockVariantSelect() {
    F(this._dealBlockElement, "variant-selected", (t) => {
      const { variantId: e } = t.detail;
      p("listenForBlockVariantSelect", e), this._changeCurrentVariant(e);
    });
  }
  _listenForBlockVariantsChange() {
    F(this._dealBlockElement, "variants-changed", (t) => {
      var a, o, s;
      clearTimeout(this._updateQuantityInputTimeoutHandle);
      const { pricing: e } = t.detail;
      this._items = this._dealBlockElement.items(), v("Selected items changed", this._items);
      const n = this._items.filter(
        (l) => this._isMainProductItem(l)
      ), r = n.find((l) => l.id == this._currentVariantId) || n[0];
      if (r) {
        if (this._changeCurrentVariant(r.id), (a = this._productBlock.addToCartForm()) == null || a.updateItem(r), this._changeQuantityInput(), (o = this._productBlock.addToCartButton()) == null || o.updatePrice(e.discountedPrice), clearTimeout(this._updateAddToCartButtonPriceTimeoutHandle), this._updateAddToCartButtonPriceTimeoutHandle = setTimeout(
          () => {
            var l;
            return (l = this._productBlock.addToCartButton()) == null ? void 0 : l.updatePrice(e.discountedPrice);
          },
          2e3
        ), (s = this._productBlock.addToCartForm()) == null || s.toggleAcceleratedCheckoutButtons(this._items.length <= 1), this._isFirstVariantChange && (this._updateQuantityInputTimeoutHandle = setTimeout(() => {
          this._changeQuantityInput(), delete this._updateQuantityInputTimeoutHandle;
        }, 1e3), this._isFirstVariantChange = !1), this._dealBlockSettings.updateNativePrice) {
          clearTimeout(this._updateNativePriceTimeoutHandle);
          const l = this._dealBlockSettings.updateNativePriceType === "item" ? e.discountedPricePerItem : e.discountedPrice, c = this._dealBlockSettings.updateNativePriceType === "item" ? e.fullPricePerItem : e.fullPrice;
          bt(l, c, this._globalConfig), this._updateNativePriceTimeoutHandle = setTimeout(() => {
            bt(l, c, this._globalConfig);
          }, 1e3);
        }
        this._reconvertPrices();
      }
    });
  }
  _reconvertPrices() {
    var t, e, n, r;
    p("reconvertPrices");
    try {
      (t = window.bucksCC) != null && t.reConvert && window.bucksCC.reConvert(), (e = window.baCurr) != null && e.refreshConversion && window.baCurr.refreshConversion(), (n = window.DoublyGlobalCurrency) != null && n.convertAll && window.DoublyGlobalCurrency.convertAll(), (r = window.conversionBearAutoCurrencyConverter) != null && r.convertPricesOnPage && window.conversionBearAutoCurrencyConverter.convertPricesOnPage(), window.mlvedaload && window.mlvedaload();
    } catch (a) {
      console.error(a);
    }
  }
  _changeCurrentVariant(t) {
    const e = this._product.variants.find((a) => a.id == t);
    if (p("_changeCurrentVariant", {
      variantId: t,
      currentVariantId: this._currentVariantId
    }), this._currentVariantId == t || (this._currentVariantId = t, !e))
      return;
    const n = this._productBlock.variantPicker();
    if (!n)
      return;
    (this._globalConfig.featureFlags.remove_variant_change_delay ? !this._dealBlockElement.dataset.nativeVariantChangeInProgress : !0) && (clearTimeout(window.kachingBundlesCurrentVariantChangeInProgress), window.kachingBundlesCurrentVariantChangeInProgress = setTimeout(() => {
      delete window.kachingBundlesCurrentVariantChangeInProgress;
    }, 1e3));
    for (const [a, o] of e.options.entries()) {
      const s = this._product.options[a], l = s.name, c = s.optionValues.find(
        (d) => d.name === o
      ).id;
      n.select(
        a + 1,
        c,
        l,
        o,
        this._product.id,
        e.id
      );
    }
  }
  /* Add to cart */
  _listenForAddToCartClick() {
    const t = this._productBlock.addToCartButton();
    if (!t)
      return;
    if (this._globalConfig.featureFlags.intercept_cart_request) {
      const a = this._dealBlockSettings.nanoId || this._dealBlockSettings.id;
      t.onClick(() => {
        j.setFallbackDeal(a, this._product);
      });
    }
    const e = () => window.kachingBundlesDisableAddToCartHandling ? !1 : this._dealBlockSettings.skipCart || this._isUpcartAppEnabled() || this._isOpusAppEnabled() || this._isKrakenCartAppEnabled() ? !0 : this._globalConfig.featureFlags.intercept_cart_request ? !1 : this._items.length > 1, n = async () => {
      var a;
      if (this._dealBlockSettings.skipCart) {
        await this._addAllItemsToCart(), window.kachingCartApi && (p("Kaching Cart update tiered promotions bar"), await window.kachingCartApi.updateTieredPromotionsBar()), window.location.href = W("checkout");
        return;
      }
      if (this._isUpcartAppEnabled()) {
        try {
          window.upcartOpenCart && window.upcartOpenCart();
        } catch (o) {
          console.error("upcartOpenCart error", o);
        }
        await this._addAllItemsToCart(), window.upcartRefreshCart && window.upcartRefreshCart();
        return;
      }
      if (this._isOpusAppEnabled()) {
        try {
          window.opusOpen && window.opusOpen();
        } catch (o) {
          console.error("opusOpen error", o);
        }
        await this._addAllItemsToCart(), window.opusRefreshCart && window.opusRefreshCart();
        return;
      }
      if (this._isKrakenCartAppEnabled()) {
        try {
          (a = window.KrakenCart) != null && a.toggleCart && window.KrakenCart.toggleCart(!0);
        } catch (o) {
          console.error("KrakenCart error", o);
        }
        await this._addAllItemsToCart();
        return;
      }
      return this._addItemsExceptCurrentToCart();
    }, r = () => this._dealBlockSettings.skipCart || this._isUpcartAppEnabled() || this._isOpusAppEnabled() || this._isKrakenCartAppEnabled();
    t.onClickIfConditionMet(
      e,
      n,
      r
    ), !this._globalConfig.featureFlags.intercept_cart_request && (this._setupUpcart(), this._setupOpus(), this._setupKrakenCart());
  }
  _setupUpcart() {
    window.upcartShouldSkipAddToCartInterceptor = !0;
    const t = window.upcartShouldSkipAddToCart;
    window.upcartShouldSkipAddToCart = (e) => typeof t == "function" && t(e) === !0 ? !0 : e.includes("kaching_bundles=true");
  }
  _setupOpus() {
    [
      "the-gloria-skincare.myshopify.com",
      "xzxihx-8t.myshopify.com",
      "e76602-61.myshopify.com"
    ].includes(this._globalConfig.shopifyDomain) && (window.OpusNoATC = !0);
  }
  _setupKrakenCart() {
    window.krakenCartIsFormATCEnabled = !1;
  }
  _isUpcartAppEnabled() {
    return this._globalConfig.featureFlags.intercept_cart_request || this._globalConfig.shopifyDomain === "qu1udi-ws.myshopify.com" ? !1 : !!D("#UpcartPopup") || !!window.upcartDocumentOrShadowRoot;
  }
  _isOpusAppEnabled() {
    return this._globalConfig.featureFlags.intercept_cart_request || ![
      "the-gloria-skincare.myshopify.com",
      "xzxihx-8t.myshopify.com",
      "e76602-61.myshopify.com"
    ].includes(this._globalConfig.shopifyDomain) ? !1 : window.opusActive || !1;
  }
  _isKrakenCartAppEnabled() {
    var t;
    return this._globalConfig.featureFlags.intercept_cart_request ? !1 : ((t = window.KrakenCart) == null ? void 0 : t.isActive) && window.KrakenCart.isActive() || !1;
  }
  async _addItemsExceptCurrentToCart() {
    var s;
    p("addItemsExceptCurrentToCart", this._items);
    const t = (s = this._productBlock.addToCartForm()) == null ? void 0 : s.currentVariantId();
    setTimeout(() => {
      t != this._currentVariantId && C("different_current_variant_v3", {
        form: t,
        object: this._currentVariantId
      });
    });
    const e = this._items.findIndex(
      (l) => this._isMainProductItem(l) && l.id == t
    ), n = this._items.filter(
      (l, c) => c !== e
    ), r = n.filter((l) => l.parent_id), a = n.filter((l) => !l.parent_id), o = [
      ...r.reverse(),
      ...a
    ].map(({ parent_id: l, ...c }) => c);
    v("Adding only extra items to cart", o), await this._makeAddToCartRequest({
      items: o,
      partial: !0
    });
  }
  async _addAllItemsToCart() {
    var e, n;
    p("addAllItemsToCart", this._items);
    let t = this._items;
    t.length === 0 && (t = [
      {
        id: (n = (e = this._productBlock.addToCartForm()) == null ? void 0 : e.currentVariantId()) != null ? n : this._currentVariantId,
        quantity: 1,
        properties: {}
      }
    ]), v("Adding all items to cart", t), await this._makeAddToCartRequest({ items: t });
  }
  _collectProperties() {
    const e = k(
      '[name^="properties"]'
    ).map((n) => [n.name.match(/properties\[(.*)\]/)[1], n.value]).filter(([n]) => n !== "__kaching_bundles");
    return Object.fromEntries(e);
  }
  _isMainProductItem(t) {
    const e = this._kachingBundlesProperty(t);
    return e ? e.main || !1 : !0;
  }
  _kachingBundlesProperty(t) {
    return t.properties.__kaching_bundles ? JSON.parse(
      t.properties.__kaching_bundles
    ) : null;
  }
  async _makeAddToCartRequest({
    items: t,
    partial: e = !1
  }) {
    const n = this._collectProperties(), r = t.map((s) => {
      var l;
      return !this._isMainProductItem(s) && !((l = this._kachingBundlesProperty(s)) != null && l.collectionBreaksProduct) ? s : {
        ...s,
        properties: { ...n, ...s.properties }
      };
    });
    setTimeout(() => this._logCollectionBreakProperties(n));
    const a = { kaching_bundles: "true" };
    e && (a.partial = "true");
    const o = {
      "Content-Type": "application/json"
    };
    e || (o["X-Kaching-Cart-Ignore"] = "1"), await fetch(W("cart/add.js", a), {
      method: "POST",
      body: JSON.stringify({ items: r }),
      headers: o
    });
  }
  _logCollectionBreakProperties(t) {
    if (!this._dealBlockSettings.collectionBreaksEnabled)
      return;
    const e = Object.fromEntries(
      Object.entries(t).filter(
        ([n]) => !n.startsWith("__kaching_")
      )
    );
    Object.keys(e).length !== 0 && C("collection_break_properties", {
      properties: e
    });
  }
}
class Re {
  constructor(t) {
    this._submitInProgress = !1, this._ignoreClick = !1, this._clickHandler = null, this._onClickCallback = null, this.button = t;
  }
  onClick(t) {
    this._onClickCallback = t;
  }
  onClickIfConditionMet(t, e, n) {
    this._clickHandler = {
      condition: t,
      callback: e,
      shouldPreventDefault: n
    }, this._registerClickHandler();
  }
  replaceButton(t) {
    v("New add to cart button", { button: t }), this.button = t, this._clickHandler && this._registerClickHandler();
  }
  _registerClickHandler() {
    if (!this._clickHandler)
      return;
    const t = async (n) => {
      this._onClickCallback && this._onClickCallback();
      const r = this._clickHandler.condition(), a = this._clickHandler.shouldPreventDefault();
      if (this._ignoreClick || v("Add to cart button clicked"), p("AddToCartButton#interceptClick", {
        conditionMet: r,
        preventDefault: a,
        submitInProgress: this._submitInProgress,
        ignoreClick: this._ignoreClick
      }), !!r) {
        if (this._submitInProgress) {
          this._submitInProgress = !1;
          return;
        }
        if (!this._ignoreClick) {
          if (this._submitInProgress = !0, this._ignoreClick = !0, this.button.disabled = !0, setTimeout(() => {
            this._ignoreClick = !1;
          }, 1e3), n.preventDefault(), n.stopPropagation(), n.stopImmediatePropagation(), await this._clickHandler.callback(), this.button.disabled = !1, a) {
            this._submitInProgress = !1;
            return;
          }
          await new Promise((o) => setTimeout(o, 200)), this.button.click();
        }
      }
    };
    this.button.addEventListener("click", t, !0);
  }
  updatePrice(t) {
    const e = this._findAddToCartPriceElement(this.button);
    e && (e.innerHTML = t.amount > 0 ? t.formatted : "");
  }
  _findAddToCartPriceElement(t) {
    if (!t.childNodes.length)
      return null;
    const e = t.childNodes[0].nodeValue;
    if (e && e.match(/\d/) && !e.match(/\p{L}{4}/u) && !e.includes("%"))
      return t;
    for (const n of t.childNodes) {
      const r = this._findAddToCartPriceElement(n);
      if (r)
        return r;
    }
    return null;
  }
}
class Qe {
  constructor(t, e, n, r) {
    this._acceleratedCheckoutButtonsEnabled = !0, this._currentItem = null, this._variantIdChangeCallback = null, this._sellingPlanChangeCallback = null, this._variantIdIntervalId = null, this._sellingPlanObserver = null, p("AddToCartForm", {
      form: t,
      addQuantityInput: e,
      allowSellingPlanUpdate: n
    }), this.form = t, this._addQuantityInput = e, this._allowSellingPlanUpdate = n, this._abTestRunning = r, this._addAbTestSessionId();
  }
  _addAbTestSessionId() {
    if (!this._abTestRunning)
      return;
    const t = this._findOrCreateInput(
      "properties[__kaching_session_id]"
    );
    t.value = R();
  }
  updateItem(t) {
    p("AddToCartForm#updateItem", [this.form, t]), this._currentItem = t, this._updateIdInput(t.id), this._updateQuantityInput(t.quantity), this._updateKachingBundlesPropertyInput(t.properties), this._updateSellingPlanInput(t.selling_plan);
  }
  currentVariantId() {
    const t = this._findInput("id");
    if (t)
      return Number(t.value);
  }
  onVariantIdChange(t) {
    this._variantIdChangeCallback = t, this._registerVariantIdObserver();
  }
  _registerVariantIdObserver() {
    if (!this._variantIdChangeCallback)
      return;
    this._variantIdIntervalId !== null && (window.clearInterval(this._variantIdIntervalId), this._variantIdIntervalId = null);
    const t = this._variantIdChangeCallback, e = D('input[name="id"]', this.form);
    e && rt(e, "value", (r, a) => {
      r !== a && a && t(Number(a));
    });
    const n = D(
      'select[name="id"]',
      this.form
    );
    if (n) {
      let r;
      this._variantIdIntervalId = window.setInterval(() => {
        const a = n.value;
        r !== a && a && (r = a, t(Number(a)));
      }, 100);
    }
  }
  onSellingPlanChange(t) {
    this._sellingPlanChangeCallback = t, this._registerSellingPlanObserver();
  }
  _registerSellingPlanObserver() {
    if (this._allowSellingPlanUpdate || !this._sellingPlanChangeCallback)
      return;
    this._sellingPlanObserver && (this._sellingPlanObserver.disconnect(), this._sellingPlanObserver = null);
    const t = this._sellingPlanChangeCallback;
    let e, n = null;
    const r = (a) => {
      const o = a == null ? void 0 : a.value;
      e !== o && (e = o, t(o ? Number(o) : void 0)), a !== n && (n = a, a && rt(a, "value", (s, l) => {
        e !== l && (e = l, t(l ? Number(l) : void 0));
      }));
    };
    r(this._findInput("selling_plan")), this._sellingPlanObserver = new MutationObserver((a) => {
      a.some((o) => o.type === "childList") && r(this._findInput("selling_plan"));
    }), this._sellingPlanObserver.observe(this.form, {
      childList: !0,
      subtree: !0
    });
  }
  toggleAcceleratedCheckoutButtons(t) {
    const e = "kaching-bundles-form--different-variants-selected";
    this._acceleratedCheckoutButtonsEnabled = t, t ? this.form.classList.remove(e) : this.form.classList.add(e);
  }
  _cleanupObservers() {
    this._variantIdIntervalId !== null && (window.clearInterval(this._variantIdIntervalId), this._variantIdIntervalId = null), this._sellingPlanObserver && (this._sellingPlanObserver.disconnect(), this._sellingPlanObserver = null);
  }
  replaceForm(t) {
    v("New add to cart form", { form: t }), this._cleanupObservers(), this.form = t, this._addAbTestSessionId(), this.toggleAcceleratedCheckoutButtons(
      this._acceleratedCheckoutButtonsEnabled
    ), this._currentItem && this.updateItem(this._currentItem), this._registerVariantIdObserver(), this._registerSellingPlanObserver();
  }
  _updateIdInput(t) {
    const e = this._findOrCreateInput("id"), n = String(t);
    this._ensureSelectOptionExists(e, n), e.disabled = !1, e.value = n;
  }
  _updateQuantityInput(t) {
    p("AddToCartForm#_updateQuantityInput", t);
    let e = null;
    this._addQuantityInput ? e = this._findOrCreateInput("quantity") : e = this._findInput("quantity"), e && (e.disabled = !1, e.value = String(t));
  }
  _updateKachingBundlesPropertyInput(t) {
    var e, n;
    if (t.__kaching_bundles) {
      const r = this._findOrCreateInput(
        "properties[__kaching_bundles]"
      );
      r.disabled = !1, r.value = this._encodeBundlesProperty(
        t.__kaching_bundles
      );
      const a = (n = (e = window.Shopify.theme) == null ? void 0 : e.schema_name) == null ? void 0 : n.toLowerCase();
      a != null && a.includes("pipeline") && (r.dataset.morphSkip = "true");
    } else {
      const r = this._findInput("properties[__kaching_bundles]");
      r == null || r.remove();
    }
  }
  _encodeBundlesProperty(t) {
    var n, r;
    const e = (r = (n = window.Shopify.theme) == null ? void 0 : n.schema_name) == null ? void 0 : r.toLowerCase();
    return e != null && e.includes("shrine pro") || e != null && e.includes("ascendify") ? btoa(t) : t;
  }
  _updateSellingPlanInput(t) {
    if (this._allowSellingPlanUpdate)
      if (t) {
        const e = this._findOrCreateInput("selling_plan");
        e.disabled = !1, e.value = String(t);
      } else {
        const e = this._findInput("selling_plan");
        e == null || e.remove();
      }
  }
  _findOrCreateInput(t) {
    return this._findInput(t) || this._createInput(t);
  }
  _ensureSelectOptionExists(t, e) {
    if (!(t instanceof HTMLSelectElement)) return;
    if (!Array.from(t.options).some(
      (r) => r.value === e
    )) {
      const r = K("option");
      r.value = e, r.text = "", t.appendChild(r);
    }
  }
  _findInput(t) {
    return D(
      `[name="${t}"]`,
      this.form
    );
  }
  _createInput(t) {
    const e = K("input");
    return e.type = "hidden", e.name = t, this.form.prepend(e), e;
  }
}
const qt = [
  'form[action*="/cart/add"]',
  "form[data-instant-form-product-url]"
  // Instant page builder
], at = [
  '[data-pf-type^="ProductATC"]',
  // PageFly sometimes uses ProductATC2
  "button.gp-button-atc",
  // Gempages
  "gp-product-button button",
  // Gempages v7
  "x-buy-button",
  // Minimog
  "button.button--addToCart",
  // Booster
  'button[type="submit"]',
  'input[type="submit"]'
], Nt = [
  // Gempages
  [
    '[data-icon="gpicon-product-cartbutton"]',
    '[data-icon="gpicon-product-quantity"]'
  ],
  // Gempages v7
  ["gp-product-button", "gp-product-quantity"],
  // Dawn (and other free themes)
  ["product-form", ".product-form__quantity"],
  // PageFly app
  ['[data-pf-type="ProductATC"]', '[data-pf-type="ProductQuantity"]'],
  // Debut
  [".product-form__item--submit", 'label[for="Quantity-product-template"]'],
  // Debutify
  [".product-single__add-to-cart", ".product-single__quantity"],
  // Impact
  [".product-info__buy-buttons", ".product-info__quantity-selector"],
  // Prestige
  [
    ".ProductForm__BuyButtons, .ProductForm__AddToCart",
    ".ProductForm__QuantitySelector"
  ],
  // Prestige (v7)
  ['[data-block-type="buy-buttons"]', '[data-block-type="quantity-selector"]'],
  // Envy
  [".product-page--submit-action", ".quantity-controls__outer"],
  // Warehouse
  [".product-form__payment-container", ".product-form__info-item--quantity"],
  // Atlantic
  ["[data-product-submit]", ".product-quantity-input"],
  // Empire
  [".product-form--atc", ".product-form--atc-qty"],
  // Turbo
  [".purchase-details", ".purchase-details__quantity"],
  // Expanse
  [".product-single__form .payment-buttons", ".product__quantity"],
  // Minimal
  [".product-form--wide", ".product-single__quantity"],
  // Brooklyn
  [".product-single__add-to-cart", ".product-single__quantity"],
  // Blockshop
  [".product-form--button-container", null],
  // Venture
  [".product-form__item--submit", ".product-form__item--quantity"],
  // Showcase
  [".product-detail__form__action", null],
  // Palo Alto
  [".product__submit__buttons", null],
  // Symmetry
  [".buy-buttons-row", ".quantity-wrapper"],
  // Kalles, Unsen
  [".t4s-product-form__buttons", "[data-quantity-wrapper]"],
  // Alchemy
  [".qty-wrapper--with-payment-button", ".product-qty"],
  // Baseline
  [".shopify-product-form", ".product-quantity-block"],
  // Shapes
  [".shopify-product-form", ".product-block-quantity-selector"],
  // Colors
  [".type_buy_buttons", ".type_quantity_selector"],
  // Motion
  [".product-single__form .add-to-cart", ".product__quantity"],
  // Avenue
  [".purchase-section", ".quantity.form"],
  // Ella
  [".product-form__buttons", ".quantity_selector"],
  // Booster
  [".product__atc", ".quantity--input"],
  // Focal
  [".product-form__payment-container", ".quantity-selector"],
  // EComposer
  [".ecom-product-single__add-to-cart", ".ecom-product-single__quantity"],
  // Solodrop
  [".product-form__submit", ".product__quantity"],
  // Enterprise
  [".product-info__add-to-cart", "quantity-input"],
  // Yuva
  [".yv-checkout-btn", ".yv-product-quantity"],
  // Reformation
  [".product-add-to-cart-container", "quantity-selector"],
  // Pipeline
  [".product__block__buttons", ".product__block__quantity"],
  // Minimog
  ["x-buy-button", "x-quantity-input"],
  // Xtra
  [".submit:has(.overlay-buy_button)", ".input-amount"],
  // Instant page builder
  [
    '[data-instant-action-type="redirect-to-cart"]',
    '[data-instant-type="container"]:has(> .instant-quantity-input)'
  ]
];
class x {
  static find(t, e) {
    let n = t.parentElement;
    for (; n; ) {
      if (e) {
        const o = k(
          e,
          n
        );
        if (o.length > 0)
          return new x(o);
      }
      const r = D(
        [
          "variant-selects",
          "variant-radios",
          "variant-picker",
          "product-variants",
          "gp-product-variants",
          ".gf_variants-wrapper",
          '[data-pf-type="ProductVariantSwatches"]',
          ".product-selectors",
          ".product-block-variant-picker",
          "dm-variant-selects",
          "simple-variant-picker"
        ].join(", "),
        n
      );
      if (r) return new x([r]);
      let a = k(
        [
          ".selector-wrapper",
          ".radio-wrapper",
          ".variant-wrapper",
          "div[data-product-option]",
          ".pp-variant-picker"
        ].join(", "),
        n
      );
      if (window.Shopify.shop && ["28212b.myshopify.com", "9bd9ad.myshopify.com"].includes(
        window.Shopify.shop
      ) && (a = k(
        ".selector-wrapper, .radio-wrapper, .variant-wrapper, .select-wrapper, div[data-product-option]",
        n
      )), a.length > 0) {
        const o = a.filter(
          (s) => !a.some(
            (l) => l !== s && l.contains(s)
          )
        );
        return new x(o);
      }
      n = n.parentElement;
    }
    return null;
  }
  constructor(t) {
    this._elements = t;
  }
  elements() {
    return this._elements;
  }
  hide() {
    for (const t of this._elements)
      t.style.display = "none", t.parentElement.classList.add(
        "kaching-bundles--variant-selects-hidden"
      );
  }
  select(t, e, n, r, a, o) {
    p("VariantPicker#select", [
      t,
      e,
      n,
      r
    ]), this._clickRadioInput(
      t,
      e,
      n,
      r,
      a
    ) || this._setSelectValue(t, n, r) || this._setSelectVariantId(o);
  }
  _clickRadioInput(t, e, n, r, a) {
    const o = this._elements.map((c) => [...c.querySelectorAll("input")]).flat();
    let s = o.filter(
      (c) => [
        n,
        `${n}-${t}`,
        `options[${n}]`,
        `option${t}`,
        `option-${a}-${t - 1}`
      ].includes(c.name.trim())
    );
    s.length || (s = o.filter(
      (c) => c.dataset.optionPosition ? Number(c.dataset.optionPosition) === t : !1
    )), s.length || (s = o.filter((c) => c.type === "radio"));
    const l = s.find(
      (c) => c.value == r || c.value === String(e)
    );
    return l ? (p("VariantPicker#_clickRadioInput", l), l.click(), !0) : !1;
  }
  _setSelectValue(t, e, n) {
    const a = this._elements.map((s) => [...s.querySelectorAll("select")]).flat().find((s) => !!([`options[${e}]`, `option${t}`].includes(s.name) || s.dataset.index === `option${t}` || s.dataset.optionName === e || s.id === `SingleOptionSelector-product-${t - 1}` || s.id === `p-variant-dropdown-${t}`));
    return !a || ![...a.options].find(
      (s) => s.value == n
    ) ? !1 : a.value === n ? (p("VariantPicker#_setSelectValue - already set", {
      variantSelect: a,
      optionValue: n
    }), !0) : (p("VariantPicker#_setSelectValue", { variantSelect: a, optionValue: n }), a.value = n, a.dispatchEvent(new Event("change", { bubbles: !0 })), !0);
  }
  _setSelectVariantId(t) {
    const n = this._elements.map((r) => [...r.querySelectorAll("select")]).flat().find(
      (r) => [...r.options].find((a) => Number(a.value) === t)
    );
    return n ? n.value === String(t) ? (p("VariantPicker#_setSelectVariantId - already set", {
      variantSelect: n,
      variantId: t
    }), !0) : (p("VariantPicker#_setSelectVariantId", { variantSelect: n, variantId: t }), n.value = String(t), n.dispatchEvent(new Event("change", { bubbles: !0 })), !0) : !1;
  }
}
class Ue {
  constructor(t, e, n) {
    this._variantPicker = null, this._quantityInput = null, this._onQuantityChange = null, this._addToCartForm = null, this._addToCartButton = null, this._placeholder = t, this._globalConfig = e, this._dealBlockSettings = n;
  }
  initialize() {
    this._findVariantPicker(), this._observeVariantPickerRemoval(), this._findQuantityInput(), this._listenForQuantityInputChange(), this._observeQuantityInputRemoval(), this._findAddToCartForm(), this._observeAddToCartFormRemoval(), this._findAddToCartButton(), this._observeAddToCartButtonRemoval();
  }
  variantPicker() {
    return this._variantPicker;
  }
  quantityInput() {
    return this._quantityInput;
  }
  addToCartForm() {
    return this._addToCartForm;
  }
  addToCartButton() {
    return this._addToCartButton;
  }
  onQuantityInputChange(t) {
    this._onQuantityChange = t;
  }
  _findVariantPicker() {
    const t = x.find(
      this._placeholder,
      this._globalConfig.customSelectors.variantPicker
    );
    t && (this._dealBlockSettings.hideVariantPicker && t.hide(), this._variantPicker = t);
  }
  _observeVariantPickerRemoval() {
    this._variantPicker && M(this._variantPicker.elements()[0], () => {
      var t, e;
      this._findVariantPicker(), v("New variant picker", {
        picker: (t = this._variantPicker) == null ? void 0 : t.elements()
      }), C(
        "variant_picker_removed",
        {
          recreated: !!this._variantPicker,
          theme: (e = window.Shopify.theme) == null ? void 0 : e.schema_name
        },
        0.01
      ), this._observeVariantPickerRemoval();
    });
  }
  _findQuantityInput() {
    const t = this._findQuantityElements(), n = nt(
      this._placeholder,
      t,
      6
    );
    if (!n)
      return;
    this._globalConfig.keepQuantityInput || (n.style.display = "none");
    const r = n.matches("input") ? n : n.querySelector("input");
    this._quantityInput = r;
  }
  _listenForQuantityInputChange() {
    this._quantityInput && (F(this._quantityInput, "change", () => {
      this._onQuantityChange && this._onQuantityChange(Number(this._quantityInput.value));
    }), rt(this._quantityInput, "value", (t, e) => {
      t !== e && this._onQuantityChange && this._onQuantityChange(Number(e));
    }));
  }
  _observeQuantityInputRemoval() {
    this._quantityInput && M(this._quantityInput, () => {
      var t;
      this._findQuantityInput(), this._listenForQuantityInputChange(), v("New quantity input", {
        input: this._quantityInput
      }), C(
        "quantity_input_removed",
        {
          recreated: !!this._quantityInput,
          theme: (t = window.Shopify.theme) == null ? void 0 : t.schema_name
        },
        0.01
      ), this._observeQuantityInputRemoval();
    });
  }
  _findQuantityElements() {
    const t = this._globalConfig.customSelectors.quantity;
    if (t) {
      const e = k(t);
      if (e.length)
        return e;
    }
    for (const [e, n] of Nt) {
      if (!n)
        continue;
      const r = k(n);
      if (r.length)
        return r;
    }
    return k(".product-form__quantity");
  }
  _findAddToCartForm() {
    const t = this._findCartForm();
    if (!t)
      return;
    const e = !!this._dealBlockSettings.subscriptionsEnabled || this._dealBlockSettings.dealBars.some(
      (n) => n.dealBarType === "subscription"
    );
    this._addToCartForm = new Qe(
      t,
      !this._quantityInput,
      e,
      !!this._dealBlockSettings.abTestVariantNumber
    );
  }
  _findCartForm() {
    let t = this._placeholder.parentElement;
    for (; t; ) {
      for (const e of qt)
        for (const n of [
          this._globalConfig.customSelectors.addToCartButton,
          ...at,
          "button"
        ]) {
          if (!n)
            continue;
          const r = D(
            `${e} ${n}`,
            t
          );
          if (r)
            return r.closest(e);
        }
      t = t.parentElement;
    }
    return null;
  }
  _observeAddToCartFormRemoval() {
    var e;
    const t = (e = this._addToCartForm) == null ? void 0 : e.form;
    window.Shopify.designMode || !t || M(t, () => {
      var r, a;
      const n = this._findCartForm();
      n && ((r = this._addToCartForm) == null || r.replaceForm(n), C(
        "cart_form_removed",
        {
          theme: (a = window.Shopify.theme) == null ? void 0 : a.schema_name
        },
        0.01
      ), this._observeAddToCartFormRemoval());
    });
  }
  _findAddToCartButton() {
    const t = this._findAddToCartButtonElement() || this._findFormlessAddToCartButtonElement();
    if (!t) {
      this._warnAboutMissingAddToCartButton(), this._addToCartButton = null;
      return;
    }
    this._addToCartButton = new Re(t);
  }
  _findAddToCartButtonElement() {
    var r;
    const t = (r = this.addToCartForm()) == null ? void 0 : r.form;
    if (!t)
      return null;
    if (this._globalConfig.customSelectors.addToCartButton) {
      const a = D(
        this._globalConfig.customSelectors.addToCartButton,
        t
      );
      if (a)
        return a;
    }
    const e = [];
    for (const a of at) {
      const o = k(a, t);
      e.push(...o);
    }
    const n = nt(
      this._placeholder,
      e
    );
    return n || t.querySelector("button");
  }
  _findFormlessAddToCartButtonElement() {
    if (this._addToCartForm || this._globalConfig.featureFlags.intercept_cart_request !== !0 || !this._globalConfig.customSelectors.addToCartButton)
      return null;
    const t = this._globalConfig.customSelectors.addToCartButton;
    if (!t)
      return null;
    const e = k(t);
    return e.length === 0 ? null : nt(
      this._placeholder,
      e,
      3
    );
  }
  _observeAddToCartButtonRemoval() {
    this._addToCartButton && M(this._addToCartButton.button, () => {
      var e;
      let t = this._findAddToCartButtonElement() || this._findFormlessAddToCartButtonElement();
      t ? this._addToCartButton.replaceButton(t) : this._addToCartButton = null, C(
        "add_to_cart_button_removed",
        {
          recreated: !!t,
          theme: (e = window.Shopify.theme) == null ? void 0 : e.schema_name
        },
        0.01
      ), this._observeAddToCartButtonRemoval();
    });
  }
  _warnAboutMissingAddToCartButton() {
    new URLSearchParams(window.location.search).get("source") !== "visualPreviewInitialLoad" && console.log(
      "%c[Kaching Bundles] Add to cart button not found. Please add a selector to the settings page or contact support.",
      "background: #f8d7da; color: #721c24; padding: 8px; border-left: 4px solid #f5c6cb;"
    );
  }
}
const ze = (i, t, e, n, r) => {
  if (!e.stickyAtcEnabled || document.querySelector(".kaching-bundles-sticky-atc-wrapper"))
    return;
  const a = document.createElement("div");
  a.classList.add("kaching-bundles-sticky-atc-wrapper"), document.body.appendChild(a);
  const o = document.createElement("div");
  o.classList.add("kaching-bundles-sticky-atc-spacer"), a.appendChild(o);
  const s = document.createElement("kaching-bundles-sticky-atc");
  s.style.transition = "none", setTimeout(() => {
    s.style.transition = "";
  }, 100), s.setAttribute(
    "sticky-atc",
    JSON.stringify(e.stickyAtc)
  ), s.setAttribute("config", JSON.stringify(i)), s.setAttribute("translations", JSON.stringify(n)), s.setAttribute("product", JSON.stringify(r)), s.setAttribute("deal-block", JSON.stringify(e)), a.appendChild(s), s.addEventListener(
    "kaching-bundles-sticky-atc-clicked",
    () => {
      const h = t.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: h,
        behavior: "smooth"
      });
    }
  ), new IntersectionObserver(
    ([d]) => {
      const h = d.boundingClientRect.top < 0 && !d.isIntersecting;
      s.classList.toggle(
        "kaching-bundles-sticky-atc--visible",
        h
      );
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "0px"
    }
  ).observe(t), new ResizeObserver(() => {
    const d = s.offsetHeight;
    o.style.height = `${d}px`;
  }).observe(s);
};
class Ct {
  constructor(t) {
    this._globalConfig = t, setTimeout(() => {
      const e = document.querySelector(
        'link[href*="kaching-bundles.css"]'
      );
      e && M(e, () => {
        var n;
        C(
          "css_removed",
          {
            theme: (n = window.Shopify.theme) == null ? void 0 : n.schema_name
          },
          0.01
        );
      });
    }, 100);
  }
  initialize() {
    this._setupTranslations();
    const t = k(
      "kaching-bundle, kaching-bundle-deals"
    );
    this._addProductIdForPlaceholders(t), t.length === 0 && this._addPlaceholders(), this._initializePlaceholders(), this._globalConfig.abTestsRunning && ke(), this._setupPlaceholderObserver();
  }
  _setupTranslations() {
    const t = U("script#kaching-bundles-translations") || [], e = t.find(
      (n) => n.locale === this._globalConfig.locale
    );
    this._translations = e == null ? void 0 : e.translations, Te(t);
  }
  _addProductIdForPlaceholders(t) {
    const e = U("script.kaching-bundles-product[data-main]");
    if (e)
      for (const n of t)
        n.getAttribute("product-id") || n.setAttribute("product-id", e.id);
  }
  _addPlaceholders() {
    if (!D("script.kaching-bundles-deal-block-settings"))
      return;
    const t = this._findPosition();
    if (!t)
      return;
    const e = U("script.kaching-bundles-product[data-main]"), n = e && e.id || this._globalConfig.productId, r = K("kaching-bundle");
    r.setAttribute("product-id", n), t.parentElement.insertBefore(r, t);
  }
  async _initializePlaceholders() {
    const t = [
      // kaching-bundle-deals is a legacy tag
      ...k("kaching-bundle, kaching-bundle-deals")
    ].filter((s) => s.getAttribute("product-id"));
    if (p("_initializePlaceholders", t), t.length === 0) {
      window.kachingBundlesInitialized = !0, window.dispatchEvent(new CustomEvent("kaching-bundles-initialized"));
      return;
    }
    if (t.filter(
      (s) => !O(s).initialized
    ).length === 0)
      return;
    const n = await this._fetchPlaceholdersData(t);
    p("placeholdersData", n);
    const r = Array.from(n.values()).map(({ dealBlock: s }) => s).filter((s) => s != null), a = Array.from(n.values()).map(({ product: s }) => s).filter((s) => s != null);
    await H(
      this._globalConfig.shopifyDomain,
      this._globalConfig.storefrontAccessToken,
      a,
      r
    );
    const o = R();
    for (const s of t) {
      const { product: l, dealBlock: c } = n.get(s);
      if (!l || !c) {
        O(s).initialized = "skipped";
        continue;
      }
      await this._initializePlaceholder(
        s,
        l,
        c,
        o
      );
    }
    window.kachingBundlesInitialized = !0, window.dispatchEvent(new CustomEvent("kaching-bundles-initialized"));
  }
  async _initializePlaceholder(t, e, n, r) {
    var I, m;
    const a = e.id;
    this._globalConfig.webPixel ? (p("Tracking view with web pixel", window.Shopify.analytics), jt(() => {
      window.Shopify.analytics.publish("kaching_bundle_viewed", {
        product_id: a,
        deal_block_id: n.id,
        ab_test_variant_id: n.abTestVariantId,
        session_id: r
      });
    })) : (p("Tracking view without web pixel (legacy)"), setTimeout(() => {
      xt(
        this._globalConfig.shopifyDomain,
        n.id,
        a,
        n.abTestVariantId,
        r
      );
    }, 2e3));
    const o = {
      ...this._globalConfig.defaultTranslations,
      ...(I = this._translations) == null ? void 0 : I.system
    }, s = (m = this._translations) == null ? void 0 : m.dealBlocks[n.id], l = { ...o, ...s }, c = k(
      "script.kaching-bundles-product:not([data-main])"
    ).map((g) => JSON.parse(g.textContent));
    await import("./kaching-bundles-block.js");
    const d = { ...this._globalConfig };
    d.currencyRate = je(
      this._globalConfig.currencyRate,
      n.currency
    ), n.dealBars.some(
      (g) => g.dealBarType === "quantity-break" && g.quantitySelector
    ) && (d.keepQuantityInput = !1);
    const h = new Ue(t, d, n);
    h.initialize();
    const b = K(
      "kaching-bundles-block"
    );
    for (new Le(
      b,
      h,
      d,
      l,
      n,
      e,
      c
    ); t.firstChild; )
      t.removeChild(t.firstChild);
    t.appendChild(b), O(t).initialized = "true", He(b), ze(
      this._globalConfig,
      b,
      n,
      l,
      e
    );
  }
  _setupPlaceholderObserver() {
    if (window.Shopify.designMode)
      return;
    new MutationObserver((e) => {
      var r;
      e.some(
        (a) => Array.from(a.addedNodes).some((o) => {
          if (!(o instanceof HTMLElement)) return !1;
          const s = (l) => l.tagName === "KACHING-BUNDLE" && !O(l).initialized;
          return s(o) || Array.from(o.querySelectorAll("kaching-bundle")).some(
            (l) => s(l)
          );
        })
      ) && (this._globalConfig.featureFlags.reinitialize_morphed_placeholders ? (v("Initializing new kaching-bundle placeholder"), this._initializePlaceholders()) : document.querySelector(
        "#replo-fullpage-element, #replo-element-styles"
      ) || C(
        "kaching_bundle_added_v8",
        {
          theme: (r = window.Shopify.theme) == null ? void 0 : r.schema_name
        },
        0.01
      ));
    }).observe(document.body, {
      childList: !0,
      subtree: !0
    });
  }
  async _fetchPlaceholdersData(t) {
    var w, A;
    const e = t.map(
      (y) => Number(y.getAttribute("product-id"))
    ), n = this._globalConfig.locale === this._globalConfig.liquidLocale ? k("script.kaching-bundles-product[data-main]") : [], r = new Map(
      n.map((y) => {
        const _ = JSON.parse(y.textContent);
        return _.variants.length === 250 ? null : [_.id, _];
      }).filter((y) => y !== null)
    ), a = e.filter(
      (y) => !r.has(y)
    ), o = k(
      "script.kaching-bundles-deal-block-settings"
    ), s = /* @__PURE__ */ new Map();
    for (const y of e) {
      const _ = o.filter(
        (E) => Number(O(E).productId) === y
      );
      _.length && s.set(
        y,
        _.map(
          (E) => E.textContent ? JSON.parse(E.textContent) : null
        )
      );
    }
    const l = e.filter(
      (y) => !s.has(y)
    ), c = this._globalConfig.storefrontAccessToken ? new N(
      this._globalConfig.shopifyDomain,
      this._globalConfig.storefrontAccessToken
    ) : null, d = c && a.length > 0 ? z(c, {
      country: this._globalConfig.country,
      language: this._globalConfig.locale.split("-")[0].toUpperCase(),
      productIds: a,
      includeSellingPlans: this._globalConfig.accessScopes.includes(
        "unauthenticated_read_selling_plans"
      ),
      includeAvailableQuantity: this._globalConfig.accessScopes.includes(
        "unauthenticated_read_product_inventory"
      ),
      useExternalMetafieldNamespace: !1
    }) : [], h = c && l.length > 0 ? St(c, { useExternalMetafieldNamespace: !1 }) : [], [b, I] = await Promise.all([
      d,
      h
    ]), m = new Map(
      a.map((y) => [
        y,
        b.find((_) => _.id == y)
      ])
    ), g = new Map([...r, ...m]), u = R(), f = /* @__PURE__ */ new Map();
    for (const y of t) {
      const _ = Number(y.getAttribute("product-id")), E = g.get(_);
      if (!E)
        continue;
      const lt = ((w = s.get(_)) == null ? void 0 : w.filter((S) => S)) || I;
      lt.sort((S, q) => {
        const ct = !!S.marketId, Ot = !!q.marketId;
        return ct === Ot ? 0 : ct ? -1 : 1;
      });
      let T = re(lt, E);
      p("applicableDealBlocks", T), T = T.filter((S) => S.marketId ? S.marketId === this._globalConfig.marketId : !0), T = T.filter((S) => {
        if (!S.abTestVariantId)
          return !0;
        const q = At(
          u,
          S.abTestVariantsCount
        );
        return S.abTestVariantNumber === q;
      }), this._globalConfig.b2bCustomer && (T = T.filter(
        (S) => !S.excludeB2bCustomers
      )), this._globalConfig.requireCustomerLogin && !this._globalConfig.isLoggedIn && (T = []);
      const Q = (A = y.getAttribute("manual-deal-block-id")) == null ? void 0 : A.trim();
      if (Q) {
        const S = T.findIndex(
          (q) => q.id === Q || q.nanoId === Q
        );
        if (v("Manual deal override", {
          deal: T[S],
          manualDealBlockId: Q,
          manualDealBlockIndex: S
        }), S > 0) {
          const [q] = T.splice(
            S,
            1
          );
          T.unshift(q);
        }
      }
      if (!T.length) {
        f.set(y, {
          product: E,
          dealBlock: null
        });
        continue;
      }
      f.set(y, {
        product: E,
        dealBlock: T[0]
      });
    }
    return f;
  }
  _findPosition() {
    const t = this._findGempagesPosition();
    if (t)
      return t;
    const e = this._findThemePosition();
    if (e)
      return e;
    const n = this._findDefaultPosition();
    return n || null;
  }
  // Temporary
  _findGempagesPosition() {
    const t = k("gp-product-button");
    for (const e of t)
      if (!e.closest("gp-sticky"))
        return e;
    return null;
  }
  _findThemePosition() {
    for (const t of Nt) {
      const e = D(t[0]);
      if (e) {
        if (e.closest(
          ".dbtfy-sticky-addtocart, .cart-drawer, cart-drawer, cart-items"
        ))
          continue;
        return setTimeout(() => {
          var r;
          const n = e.closest(
            '[class*="cart"], [class*="Cart"]'
          );
          n && n.tagName.toLowerCase() !== "body" && !n.classList.toString().includes("add-to-cart") && !n.classList.toString().includes("AddToCart") && !n.classList.toString().includes("icartShopifyCartContent") && C(
            "theme_position_in_cart_drawer_v8",
            {
              selector: t[0],
              classes: n.classList.toString(),
              theme: (r = window.Shopify.theme) == null ? void 0 : r.schema_name
            },
            0.01
          );
        }), e;
      }
    }
    return null;
  }
  _findDefaultPosition() {
    for (const t of qt)
      for (const e of [
        this._globalConfig.customSelectors.addToCartButton,
        ...at,
        "button"
      ]) {
        if (!e)
          continue;
        const n = D(
          `${t} ${e}`
        );
        if (n)
          return n.parentElement;
      }
    return null;
  }
}
function je(i, t) {
  var e;
  return t ? ((e = window.Shopify.currency) == null ? void 0 : e.active) === t.currencyCode ? 1 : 1 / t.currencyRate * i : i;
}
function He(i) {
  const t = () => typeof window.FastClick != "undefined" || typeof window.T4SThemeSP != "undefined" && typeof window.T4SThemeSP.FastClick != "undefined" || typeof window.BEEThemeSP != "undefined" && typeof window.BEEThemeSP.FastClick != "undefined", e = setInterval(() => {
    t() && (clearInterval(e), k("*", i).forEach(
      (n) => Rt(n, "needsclick")
    ));
  }, 500);
}
const It = (i) => {
  var t;
  ((t = window.Shopify.theme) == null ? void 0 : t.theme_store_id) === 801 ? setTimeout(() => new Ct(i).initialize(), 100) : new Ct(i).initialize();
}, Ft = () => {
  if (Mt()) {
    const r = k(
      "style#kaching-bundles-custom-css"
    );
    for (const a of r)
      a.remove();
    return;
  }
  const i = U(
    "script#kaching-bundles-config"
  );
  if (!i)
    return;
  v("Shopify domain:", i.shopifyDomain), Gt();
  const t = window.Shopify.currency;
  t && (i.currencyRate = Number(t.rate));
  const e = window.Shopify.country;
  e && (i.country = e);
  const n = window.Shopify.locale;
  n && (i.locale = n), window.kachingBundlesKeepQuantityInput && (i.keepQuantityInput = !0), It(i), window.Shopify.designMode && F(window, "shopify:section:load", () => {
    It(i);
  }), Ht(), Jt(), window.kachingBundlesApi = Ee(i), setTimeout(() => {
    Bt();
  }, 1e3);
};
window.__kachingBundlesInitializeInternal = Ft;
const wt = () => {
  window.kachingBundlesDisableAutoInitialize || Ft();
};
document.readyState === "loading" ? (p("Waiting for DOMContentLoaded"), document.addEventListener("DOMContentLoaded", wt)) : wt();
