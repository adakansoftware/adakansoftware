import assert from "node:assert/strict"
import test from "node:test"

import { caseStudyKeys, getCaseStudy, getCaseStudyPaths } from "./case-studies.ts"

test("case studies publish substantial bilingual project evidence", () => {
  assert.deepEqual(caseStudyKeys, ["z-grup-insaat", "salihogullari-hafriyat"])

  for (const key of caseStudyKeys) {
    for (const locale of ["tr", "en"]) {
      const study = getCaseStudy(key, locale)
      assert.ok(study)
      assert.ok(study.sections.length >= 3)
      assert.ok(study.deliverables.length >= 4)
      assert.ok(study.faqs.length >= 3)
      assert.match(study.liveUrl, /^https:\/\//)
      assert.doesNotMatch(JSON.stringify(study), /conversion|dönüşüm oranı|trafik artışı/i)
    }
  }
})

test("case studies use localized canonical paths and the corrected Salihogullari URL", () => {
  const paths = getCaseStudyPaths()
  assert.deepEqual(paths, [
    { key: "z-grup-insaat", tr: "/projects/z-grup-insaat", en: "/projects/z-group-construction", lastModified: "2026-09-25" },
    { key: "salihogullari-hafriyat", tr: "/projects/salihogullari-hafriyat", en: "/projects/salihogullari-excavation", lastModified: "2026-09-25" },
  ])
  assert.equal(getCaseStudy("salihogullari-hafriyat", "tr").liveUrl, "https://salihogullaridemobyadakansoftware.vercel.app/")
})
