import fs from 'node:fs';
import path from 'node:path';

const REF = 'C:\\Users\\Familia\\Desktop\\Pesquisa de Mercado\\Pesquisa Camisas Sociais Performance\\01-pesquisa\\Referencia de imagens - cena e prompt';

const products = [
  {
    handle: 'long-sleeve-performance-dress-shirt',
    competitor_page: 'https://trysavid.com/product/flex-weave-shirt/',
    competitor_name: 'SAVID — Flex Weave Dress Shirt (real PDP)',
    prompt: `Professional e-commerce product photography of a men's long-sleeve performance dress shirt in navy blue, athletic tapered fit through the chest and waist. The shirt is presented in a ghost-mannequin / flat-lay hybrid style on a seamless neutral studio background (light warm-white, #F5F3EE tone). REFERENCE HIERARCHY: use the attached scene reference (SAVID Flex Weave Dress Shirt PDP capture) strictly for composition, camera angle, and framing — frontal three-quarter view with the sleeve folded to show cuff detail, product centered with even margins. PRODUCT FIDELITY: the fabric texture, collar structure, button placket, cuff design, and stitching must match the attached ATHLOS Product Master exactly once available — do not invent new design details, do not alter the silhouette, do not add embellishments not present in the Product Master. Lens: 85mm equivalent, softbox lighting from front-left and fill from front-right, neutral color temperature around 5500K, no harsh shadows. Materials to render: 4-way stretch poly-elastane blend with a subtle visible woven texture, matte finish (not glossy). Output format: 2048x2048px square, WEBP, sRGB color profile. Restrictions: no visible logos, no brand marks, no text overlays, no watermarks. Negative prompt: no wrinkles, no visible mannequin hardware, no background clutter, no warped or distorted fabric geometry, no duplicate collars.`
  },
  {
    handle: 'short-sleeve-performance-dress-shirt',
    competitor_page: 'https://www.kojofit.com/products/white-muscle-fit-bamboo-dress-shirt-long-sleeve-mens',
    competitor_name: 'Kojo Fit — Muscle Fit Bamboo Dress Shirt (real PDP, long-sleeve version used as closest available scene reference; no short-sleeve PDP was captured in this sample)',
    prompt: `Professional e-commerce product photography of a men's short-sleeve performance dress shirt in crisp white, athletic tapered fit through the chest and waist. Flat-lay presentation on a seamless neutral studio background. REFERENCE HIERARCHY: use the attached scene reference (Kojo Fit Muscle Fit Bamboo Dress Shirt PDP capture, long-sleeve variant used only for composition and lighting angle since no short-sleeve PDP exists among the competitors sampled in this research) strictly for framing, crop distance, and studio lighting setup — do not copy sleeve length from the reference. PRODUCT FIDELITY: fabric weave, collar shape, button spacing, and short sleeve hem must match the attached ATHLOS Product Master exactly once available — do not invent design details not present in the Product Master, do not lengthen the sleeve. Lens: 85mm equivalent, even studio lighting from both sides, neutral white balance. Materials: 4-way stretch poly-elastane blend, matte finish, breathable weave visible up close. Output format: 2048x2048px square, WEBP, sRGB. Restrictions: no logos, no brand marks, no text overlays. Negative prompt: no wrinkles, no shadows crossing the collar, no mannequin parts visible, no distorted geometry, no color cast from the reference image.`
  },
  {
    handle: 'performance-polo',
    competitor_page: 'https://tailoredathlete.com/',
    competitor_name: 'Tailored Athlete — homepage lifestyle photography (general style reference only; no polo-specific PDP was captured in this sample, since Tailored Athlete\'s polo PDP was not part of the 4-store visual benchmark)',
    prompt: `Professional e-commerce product photography of a men's performance polo shirt in moss green, athletic tapered fit, torso framing on a mannequin-free flat presentation over a seamless neutral studio background. REFERENCE HIERARCHY: use the attached scene reference (Tailored Athlete homepage lifestyle capture) only as a loose style and lighting-mood reference for a fit, athletic-menswear aesthetic — this is a general brand style reference, not a product-specific PDP, since no competitor sampled in this research shows a polo PDP directly. Composition should be a clean frontal product shot, not a lifestyle scene. PRODUCT FIDELITY: ribbed collar, three-button placket, and side vents must match the attached ATHLOS Product Master exactly once available — do not invent design details. Lens: 85mm equivalent, soft even studio lighting, neutral color temperature. Materials: 4-way stretch performance pique knit, matte finish. Output format: 2048x2048px square, WEBP, sRGB. Restrictions: no logos, no visible tags, no text overlays, no lifestyle background elements carried over from the reference. Negative prompt: no wrinkles, no shadows obscuring the collar, no distorted proportions.`
  },
  {
    handle: 'stretch-chino-ankle-fit',
    competitor_page: 'https://www.nimble-made.com/products/white-broadcloth-weave',
    competitor_name: 'Nimble Made — White Broadcloth Weave dress shirt PDP (used only for studio lighting/composition reference; Nimble Made does not sell chinos, no chino-specific PDP exists among the competitors sampled)',
    prompt: `Professional e-commerce product photography of men's stretch chino trousers in charcoal grey, tapered athletic ankle fit, folded flat-lay presentation on a seamless neutral studio background. REFERENCE HIERARCHY: use the attached scene reference (Nimble Made dress shirt PDP capture) only for studio lighting setup and background tone — it is a cross-category reference since no competitor in this research sample sells chino trousers; do not copy any garment shape from the reference. PRODUCT FIDELITY: fabric texture, waistband construction, and tapered ankle opening must match the attached ATHLOS Product Master exactly once available — do not invent pocket details or stitching not present in the Product Master. Lens: 85mm equivalent, even overhead studio lighting, neutral white balance. Materials: stretch cotton-blend twill with visible fine texture, matte finish. Output format: 2048x2048px square, WEBP, sRGB. Restrictions: no logos, no visible brand tags, no text overlays. Negative prompt: no wrinkles, no distorted fold lines, no background clutter, no color cast from the reference image.`
  },
  {
    handle: 'stretch-sport-coat',
    competitor_page: 'https://tailoredathlete.com/',
    competitor_name: 'Tailored Athlete — homepage lifestyle photography (general style reference only; no blazer-specific PDP was captured in this sample)',
    prompt: `Professional e-commerce product photography of a men's stretch sport coat in graphite grey, athletic tapered fit, presented on a wooden hanger against a seamless neutral studio background. REFERENCE HIERARCHY: use the attached scene reference (Tailored Athlete homepage lifestyle capture) only as a loose style and lighting-mood reference for an athletic-menswear aesthetic — this is a general brand style reference, not a product-specific PDP, since no competitor sampled in this research shows a blazer PDP directly. Composition should be a clean product-on-hanger shot, centered, with even margins. PRODUCT FIDELITY: lapel structure, button placement, and shoulder construction must match the attached ATHLOS Product Master exactly once available — do not invent design details not present in the Product Master. Lens: 85mm equivalent, soft directional studio lighting to reveal fabric drape, neutral color temperature. Materials: stretch wool-blend suiting fabric, matte finish with subtle texture. Output format: 2048x2048px square, WEBP, sRGB. Restrictions: no logos, no brand marks, no text overlays. Negative prompt: no wrinkles, no distorted lapel geometry, no background clutter.`
  },
  {
    handle: 'performance-leather-look-belt',
    competitor_page: 'https://trysavid.com/',
    competitor_name: 'SAVID — homepage photography (general style reference only; no competitor sampled in this research sells a matching belt accessory with a captured PDP)',
    prompt: `Professional e-commerce product photography of a men's performance leather-look belt in black, coiled neatly on a seamless neutral studio background with the buckle facing up and clearly visible. REFERENCE HIERARCHY: use the attached scene reference (SAVID homepage capture) only as a loose lighting and background-tone reference — this is a general brand style reference, not a product-specific PDP, since no competitor sampled in this research shows a belt PDP. Composition should be a clean top-down or three-quarter product shot, centered. PRODUCT FIDELITY: buckle finish, stitching pattern, and strap width must match the attached ATHLOS Product Master exactly once available — do not invent design details not present in the Product Master. Lens: 85mm equivalent, soft even studio lighting to avoid harsh buckle reflections, neutral white balance. Materials: leather-look performance material with fine grain texture, matte-satin buckle finish. Output format: 2048x2048px square, WEBP, sRGB. Restrictions: no logos, no brand marks, no text overlays. Negative prompt: no scratches, no reflections obscuring texture, no distorted coil shape.`
  },
  {
    handle: 'travel-collar-stay-care-kit',
    competitor_page: 'https://www.kojofit.com/',
    competitor_name: 'Kojo Fit — homepage photography (general style reference only; no competitor sampled in this research sells a matching travel care-kit accessory with a captured PDP)',
    prompt: `Professional e-commerce product photography of a small men's travel care kit — collar stays, a fabric brush, and a mini stain-removal pen — laid out neatly beside its branded box, top-down angle, on a seamless neutral studio background. REFERENCE HIERARCHY: use the attached scene reference (Kojo Fit homepage capture) only as a loose lighting and background-tone reference — this is a general brand style reference, not a product-specific PDP, since no competitor sampled in this research shows a travel-kit PDP. Composition should be a clean, evenly spaced flat-lay of all kit components plus the box. PRODUCT FIDELITY: box design, collar stay finish, and brush handle shape must match the attached ATHLOS Product Master exactly once available — do not invent kit contents not present in the Product Master. Lens: 85mm equivalent, soft even overhead studio lighting, neutral white balance. Materials: matte cardboard box, brushed metal collar stays. Output format: 2048x2048px square, WEBP, sRGB. Restrictions: no logos beyond the ATHLOS wordmark on the box, no text overlays beyond the box itself. Negative prompt: no clutter, no shadows obscuring small items, no distorted proportions.`
  }
];

for (const p of products) {
  const dir = path.join(REF, p.handle);
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({
    competitor_page: p.competitor_page,
    competitor_name: p.competitor_name,
    expected_carousel_count: 1,
    note: 'Escopo reduzido nesta rodada: 1 imagem de referência de cena por produto (não o carrossel completo de todas as posições de PDP), suficiente para prototipar o blueprint. Ver identidade-visual.html.'
  }, null, 2));
  fs.writeFileSync(path.join(dir, 'prompts.json'), JSON.stringify({
    expected_carousel_count: 1,
    references: [{ reference_file: 'carrossel-concorrente/referencia-01.jpg', prompt: p.prompt }]
  }, null, 2));
  fs.writeFileSync(path.join(dir, 'PROMPTS-EM-INGLES.md'), `# Prompt — ${p.handle}\n\n${p.prompt}\n`);
  fs.writeFileSync(path.join(dir, 'MODELO-DE-PAGINA.md'), `# Referência de cena — ${p.handle}\n\nFonte: ${p.competitor_name}\nPDP/URL: ${p.competitor_page}\nArquivo: carrossel-concorrente/referencia-01.jpg (cópia de modelo-pagina-concorrente.jpg)\n`);
  console.log('OK', p.handle);
}
