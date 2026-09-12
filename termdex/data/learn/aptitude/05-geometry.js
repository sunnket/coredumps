/* Aptitude — geometry and mensuration. */
TD.addLessons("aptitude", [

  {
    t: "Triangles, Circles and Polygons",
    m: "geometry",
    lvl: "core",
    s: "Angle rules, the triangle centres, similarity and congruence, circle theorems and the polygon formulas — the pure geometry that tests actually ask.",
    goal: [
      "Apply the angle and side rules that eliminate options before any calculation",
      "Use similarity ratios, including the square rule for areas",
      "Recognise the four circle theorems that account for most circle questions"
    ],
    b: [
      { p: "School geometry is enormous. The slice that appears in aptitude tests is small, repetitive and heavily weighted toward triangles. This lesson is that slice, and nothing else." },

      { h: "Triangles: the rules that eliminate options" },

      {
        code: {
          lang: "text", t: "Facts that answer questions before you compute",
          lines: [
            { c: "Angles sum to 180.  Exterior angle = sum of the two opposite interiors.", w: "" },
            { c: "", w: "" },
            { c: "TRIANGLE INEQUALITY:  any side < sum of the other two", w: "" },
            { c: "                      any side > difference of the other two", w: "**Given two sides a and b, the third lies strictly between |a-b| and a+b.**", hi: true },
            { c: "", w: "" },
            { c: "The largest angle faces the largest side. Always.", w: "Orders angles from sides and vice versa with no computation." },
            { c: "", w: "" },
            { c: "Area = 1/2 x base x height", w: "" },
            { c: "     = 1/2 x a x b x sin(C)", w: "When two sides and the included angle are given." },
            { c: "     = sqrt(s(s-a)(s-b)(s-c)),  s = (a+b+c)/2", w: "Heron's formula: three sides, no height. Slow but reliable.", hi: true }
          ]
        }
      },

      {
        tbl: {
          t: "The Pythagorean triples worth recognising on sight",
          h: ["Triple", "Multiples that appear", "Why it matters"],
          rows: [
            ["**3, 4, 5**", "6-8-10, 9-12-15, 12-16-20, 15-20-25", "By far the most common in tests"],
            ["**5, 12, 13**", "10-24-26, 15-36-39", "Second most common"],
            ["**8, 15, 17**", "16-30-34", "Appears in coordinate geometry"],
            ["**7, 24, 25**", "14-48-50", "Occasional"],
            ["**9, 40, 41**", "—", "Rare, but recognising it saves a square root"]
          ]
        }
      },

      { n: "Spotting a triple saves ten to twenty seconds each time and prevents arithmetic slips under pressure. A right triangle with legs 9 and 12 has hypotenuse 15 — no squaring, no square root. Over a full paper, this alone is worth a question or two.", nt: "Why triples earn memorisation" },

      { h: "The centres, and which one a question means" },

      {
        tbl: {
          t: "Four centres, four defining lines",
          h: ["Centre", "Intersection of", "Key property"],
          rows: [
            ["**Centroid**", "The three medians", "Divides each median **2:1** from the vertex. It is the centre of mass"],
            ["**Incentre**", "The three angle bisectors", "Centre of the inscribed circle; equidistant from the three **sides**"],
            ["**Circumcentre**", "The perpendicular bisectors of the sides", "Centre of the circumscribed circle; equidistant from the three **vertices**"],
            ["**Orthocentre**", "The three altitudes", "Can lie outside the triangle when it is obtuse"]
          ]
        }
      },

      { n: "For a right triangle, the circumcentre is exactly the **midpoint of the hypotenuse**, so the circumradius is half the hypotenuse. That single fact answers a surprising number of circle-and-triangle questions in one line.", nt: "The right-triangle shortcut" },

      { h: "Similarity: the ratio that squares" },

      {
        code: {
          lang: "text", t: "The rule that gets misapplied most often",
          lines: [
            { c: "If two triangles are similar with side ratio k:", w: "" },
            { c: "", w: "" },
            { c: "  corresponding sides, perimeters, medians, heights  ->  ratio k", w: "" },
            { c: "  AREAS                                            ->  ratio k^2", w: "**Sides in 2:3 means areas in 4:9. Not 2:3.**", hi: true },
            { c: "  VOLUMES (for similar solids)                     ->  ratio k^3", w: "The 3D version, and the same trap." },
            { c: "", w: "" },
            { c: "Tests for similarity:  AA  |  SSS (proportional)  |  SAS", w: "" },
            { c: "Tests for congruence:  SSS | SAS | ASA | AAS | RHS", w: "AAA proves similarity, never congruence — same shape, any size.", hi: true },
            { c: "", w: "" },
            { c: "Basic proportionality (Thales): a line parallel to one side", w: "" },
            { c: "cuts the other two in the same ratio.", w: "The workhorse for 'find x' diagram questions." }
          ]
        }
      },

      { h: "Circles" },

      {
        tbl: {
          t: "The theorems that carry most questions",
          h: ["Theorem", "Statement"],
          rows: [
            ["**Angle at the centre**", "Twice the angle at the circumference on the same arc"],
            ["**Angle in a semicircle**", "Always 90°. A diameter subtends a right angle"],
            ["**Same segment**", "Angles subtended by the same chord on the same side are equal"],
            ["**Cyclic quadrilateral**", "Opposite angles sum to 180°"],
            ["**Tangent–radius**", "A tangent is perpendicular to the radius at the point of contact"],
            ["**Two tangents from a point**", "Equal in length"],
            ["**Alternate segment**", "The angle between a tangent and a chord equals the angle in the alternate segment"],
            ["**Intersecting chords**", "PA × PB = PC × PD for chords crossing at P"]
          ]
        }
      },

      { h: "Polygons" },

      {
        code: {
          lang: "text", t: "Five formulas that cover the topic",
          lines: [
            { c: "sum of interior angles      = (n - 2) x 180", w: "" },
            { c: "each interior angle (regular) = (n - 2) x 180 / n", w: "" },
            { c: "sum of exterior angles      = 360,  always, for any n", w: "**This is the one to use — it is constant, so it is faster.**", hi: true },
            { c: "each exterior angle (regular) = 360/n", w: "" },
            { c: "number of diagonals         = n(n - 3)/2", w: "" },
            { c: "", w: "" },
            { c: "Example: a regular polygon has interior angles of 156 degrees.", w: "" },
            { c: "  exterior = 180 - 156 = 24", w: "" },
            { c: "  n = 360/24 = 15 sides", w: "Two lines via exteriors; four via interiors.", hi: true }
          ]
        }
      },

      { trap: "In a *quadrilateral* question, check what kind it is before assuming properties. A parallelogram's diagonals bisect each other but are **not** equal; a rectangle's are equal but do **not** bisect the angles; a rhombus's are perpendicular but not equal; only a square has all three. Questions are built from exactly these near-misses." },

      {
        tryit: {
          t: "Four short ones",
          task: "(a) Two sides of a triangle are 7 and 11. How many integer values can the third side take? (b) A triangle has sides 13, 14, 15. Find its area. (c) The interior angle of a regular polygon is 162°. How many sides? (d) Two similar triangles have areas 45 and 80 cm². If a side of the smaller is 6 cm, find the corresponding side of the larger.",
          hint: "(a) triangle inequality. (b) Heron. (d) the area ratio is the square of the side ratio.",
          sol: { lang: "text", code: "(a) third side is strictly between 4 and 18\n    integers 5 to 17 inclusive  ->  13 values\n\n(b) s = 21\n    area = sqrt(21 x 8 x 7 x 6) = sqrt(7056) = 84 sq cm\n\n(c) exterior = 18  ->  n = 360/18 = 20 sides\n\n(d) area ratio 45 : 80 = 9 : 16\n    side ratio = 3 : 4\n    6 x 4/3 = 8 cm" },
          w: "The 13-14-15 triangle in (b) has area 84 and appears often enough in tests to be worth remembering outright, along with 3-4-5 (area 6) and 5-12-13 (area 30)."
        }
      }
    ],
    k: [
      "The third side lies strictly between the difference and the sum of the other two.",
      "Recognise 3-4-5, 5-12-13, 8-15-17 and their multiples on sight.",
      "The centroid divides each median 2:1 from the vertex.",
      "In a right triangle, the circumcentre is the midpoint of the hypotenuse.",
      "Similar figures: sides in ratio k, areas in k², volumes in k³.",
      "Exterior angles of any polygon sum to 360°. Use them, not interiors.",
      "Angle in a semicircle is 90°; opposite angles of a cyclic quadrilateral sum to 180°."
    ],
    r: ["Euclidean Distance"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "third side is between |a-b| and a+b", w: "the triangle inequality" },
        { c: "similar figures: areas in the ratio k^2", w: "the most-misapplied rule in geometry" },
        { c: "exterior angles of any polygon sum to 360", w: "faster than the interior formula" }
      ]
    }
  },

  {
    t: "Mensuration — 2D areas and 3D solids",
    m: "geometry",
    lvl: "core",
    s: "Every area, surface area and volume formula the exams use, plus the scaling rule and the melting-and-recasting question type.",
    goal: [
      "Recall the 2D and 3D formulas without hesitation",
      "Apply the scaling rule to *if each dimension doubles* questions",
      "Handle recasting, painting and hollow-solid questions by conserving the right quantity"
    ],
    b: [
      { p: "Mensuration is memorisation plus one idea. The memorisation is the two tables below. The idea is that every question is either *scale it* or *conserve something* — usually volume — and knowing which one it is decides the whole approach." },

      { h: "Two dimensions" },

      {
        tbl: {
          t: "Areas and perimeters",
          h: ["Shape", "Area", "Perimeter / other"],
          rows: [
            ["Square", "a²", "4a; diagonal a√2"],
            ["Rectangle", "l × b", "2(l + b); diagonal √(l² + b²)"],
            ["Triangle", "½ × b × h", "Heron's for three sides"],
            ["Equilateral triangle", "(√3/4)a²", "Height (√3/2)a"],
            ["Parallelogram", "base × height", "Not base × side"],
            ["Rhombus", "½ × d₁ × d₂", "All sides equal; diagonals perpendicular"],
            ["Trapezium", "½ × (sum of parallel sides) × height", "—"],
            ["Circle", "πr²", "Circumference 2πr"],
            ["Sector of angle θ°", "(θ/360) × πr²", "Arc length (θ/360) × 2πr"],
            ["Ring / annulus", "π(R² − r²)", "Two circles, subtracted"]
          ]
        }
      },

      { h: "Three dimensions" },

      {
        tbl: {
          t: "Volumes and surface areas",
          h: ["Solid", "Volume", "Curved / lateral SA", "Total SA"],
          rows: [
            ["Cube", "a³", "4a²", "6a²; diagonal a√3"],
            ["Cuboid", "lbh", "2h(l + b)", "2(lb + bh + hl); diagonal √(l²+b²+h²)"],
            ["Cylinder", "πr²h", "2πrh", "2πr(r + h)"],
            ["Cone", "⅓πr²h", "πrl", "πr(r + l), where l = √(r² + h²)"],
            ["Sphere", "(4/3)πr³", "—", "4πr²"],
            ["Hemisphere", "(2/3)πr³", "2πr²", "3πr²"],
            ["Prism", "base area × height", "perimeter × height", "lateral + 2 × base"],
            ["Pyramid", "⅓ × base area × height", "½ × perimeter × slant height", "lateral + base"]
          ]
        }
      },

      { n: "The cone's slant height *l* is not the same as its vertical height *h*. They relate by l² = r² + h², a Pythagorean triangle inside the cone. A question giving the slant height when you need the vertical one (or the reverse) is a standard extra step, not a different question.", nt: "Slant height versus height" },

      { h: "The scaling rule" },

      {
        code: {
          lang: "text", t: "One rule, endless questions",
          lines: [
            { c: "If every linear dimension is multiplied by k:", w: "" },
            { c: "", w: "" },
            { c: "  lengths, perimeters, radii, diagonals   ->  x k", w: "" },
            { c: "  areas, surface areas                    ->  x k^2", w: "" },
            { c: "  volumes                                 ->  x k^3", w: "**Doubling every side multiplies volume by 8, not by 2.**", hi: true },
            { c: "", w: "" },
            { c: "It runs backwards too:", w: "" },
            { c: "  'volume increased 27 times'  ->  k = 3  ->  surface area x9", w: "Cube-root the volume ratio to recover k.", hi: true },
            { c: "", w: "" },
            { c: "And it applies to percentage wording:", w: "" },
            { c: "  radius up 10%  ->  area x (1.1)^2 = 1.21  ->  up 21%", w: "The percentage lesson meeting the geometry one." }
          ]
        }
      },

      { h: "Conservation questions" },

      {
        code: {
          lang: "text", t: "Melting, recasting, digging, filling",
          lines: [
            { c: "The rule: whatever is physically preserved is what you equate.", w: "" },
            { c: "", w: "" },
            { c: "Melted and recast into a new shape   ->  VOLUME is conserved", w: "**Surface area is not. Only volume.**", hi: true },
            { c: "Wire drawn thinner and longer        ->  volume conserved" , w: "" },
            { c: "Earth dug from a well and spread     ->  volume conserved" , w: "" },
            { c: "Water poured between vessels         ->  volume conserved" , w: "" },
            { c: "A sheet folded into an open box      ->  AREA is conserved, not volume", w: "The odd one out, and it is asked precisely because of that.", hi: true },
            { c: "", w: "" },
            { c: "Example: a 12 cm radius sphere melted into 1 cm radius balls.", w: "" },
            { c: "  count = (4/3)pi(12)^3 / (4/3)pi(1)^3 = 12^3 = 1728", w: "The (4/3)pi cancels. Set up the ratio before computing anything.", hi: true }
          ]
        }
      },

      { trap: "**Painting and papering questions want surface area; filling questions want volume.** *How much water fills the tank* is volume. *How much paint covers it* is surface area. *How much does the wallpaper cost* is area, usually excluding the floor and sometimes excluding doors and windows — read the exclusions, because they are the actual difficulty of the question, not the formula." },

      { h: "Hollow solids and composite shapes" },

      {
        code: {
          lang: "text", t: "Subtract, do not re-derive",
          lines: [
            { c: "A hollow cylinder of outer radius R, inner radius r, height h:", w: "" },
            { c: "  volume of material = pi h (R^2 - r^2)", w: "**Outer solid minus inner solid.**", hi: true },
            { c: "  total surface = outer curved + inner curved + 2 rings", w: "" },
            { c: "                = 2pi R h + 2pi r h + 2pi(R^2 - r^2)", w: "Count the faces one by one; that is where the marks are lost." },
            { c: "", w: "" },
            { c: "A cone mounted on a cylinder (an ice-cream shape):", w: "" },
            { c: "  volume  = add the two volumes", w: "" },
            { c: "  surface = cylinder curved + cone curved + one base circle", w: "The joining faces vanish. Draw it before adding.", hi: true }
          ]
        }
      },

      {
        tryit: {
          t: "Four, one of each kind",
          task: "(a) The radius of a sphere increases by 20%. By what percentage does its volume increase? (b) A cylindrical tank of radius 7 m and depth 10 m is dug, and the earth is spread evenly over a field of 100 m × 40 m. Find the rise in level. (c) A cone of radius 6 and height 8 — find its total surface area. (d) A cube of side 6 cm is cut into 1 cm cubes. By what factor does the total surface area increase?",
          hint: "(b) volume conserved. (c) find the slant height first. (d) count the small cubes and their faces.",
          sol: { lang: "text", code: "(a) 1.2^3 = 1.728  ->  a 72.8% increase\n\n(b) volume dug = (22/7) x 49 x 10 = 1540 cubic m\n    spread over 4000 sq m  ->  rise = 1540/4000 = 0.385 m\n\n(c) l = sqrt(36 + 64) = 10\n    TSA = pi x 6 x (6 + 10) = 96pi sq units\n\n(d) original SA = 6 x 36 = 216\n    216 small cubes, each 6 sq cm  ->  1296\n    factor = 6 (which is the side ratio, as it must be)" },
          w: "Part (d) is the scaling rule read backwards: cutting into pieces of 1/6 the side multiplies the count by 6³ and the area of each by 1/6², so the total area goes up by exactly 6. Any cutting question follows the same two-step count."
        }
      }
    ],
    k: [
      "Scale every linear dimension by k: areas go as k², volumes as k³.",
      "Melting and recasting conserves volume, never surface area.",
      "Cone slant height l = √(r² + h²), and it is not the vertical height.",
      "Painting is surface area; filling is volume. Read which is asked.",
      "For hollow solids, subtract the inner solid and then count the faces one by one.",
      "Equilateral triangle area is (√3/4)a²; cube diagonal is a√3."
    ],
    r: ["Euclidean Distance"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "scale by k: area x k^2, volume x k^3", w: "the rule behind most mensuration questions" },
        { c: "melting and recasting conserves volume only", w: "equate the right quantity" },
        { c: "cone: l^2 = r^2 + h^2, CSA = pi r l", w: "slant height is not height" }
      ]
    }
  },

  {
    t: "Coordinate Geometry and Exam Trigonometry",
    m: "geometry",
    lvl: "intermediate",
    s: "Distance, section and area formulas, line equations and slopes, plus the small slice of trigonometry that placement and entrance tests actually use.",
    goal: [
      "Compute distances, midpoints, section points and triangle areas from coordinates",
      "Move between the forms of a straight line and read parallel or perpendicular from slopes",
      "Apply the standard heights-and-distances setup without re-deriving it"
    ],
    b: [
      { p: "Coordinate geometry appears in tests as a small, fixed set of formulas, and trigonometry appears almost exclusively as heights and distances with 30, 45 and 60 degree angles. Both are narrow enough to master in one sitting, which makes them unusually good value." },

      { h: "The coordinate toolkit" },

      {
        code: {
          lang: "text", t: "Six formulas, and that is the whole toolkit",
          lines: [
            { c: "distance     = sqrt((x2-x1)^2 + (y2-y1)^2)", w: "" },
            { c: "midpoint     = ((x1+x2)/2, (y1+y2)/2)", w: "" },
            { c: "", w: "" },
            { c: "section (internal, ratio m:n from the first point):", w: "" },
            { c: "  ((mx2 + nx1)/(m+n), (my2 + ny1)/(m+n))", w: "**Note the cross-pairing: m goes with the second point.**", hi: true },
            { c: "", w: "" },
            { c: "centroid     = ((x1+x2+x3)/3, (y1+y2+y3)/3)", w: "The plain average of the three vertices." },
            { c: "", w: "" },
            { c: "area of a triangle from three vertices:", w: "" },
            { c: "  1/2 |x1(y2-y3) + x2(y3-y1) + x3(y1-y2)|", w: "**Area zero means the three points are collinear — a common question.**", hi: true },
            { c: "", w: "" },
            { c: "slope        = (y2-y1)/(x2-x1)", w: "" }
          ]
        }
      },

      {
        tbl: {
          t: "Lines: which form to use when",
          h: ["Form", "Equation", "Use when"],
          rows: [
            ["Slope–intercept", "y = mx + c", "You know the slope and the y-intercept"],
            ["Point–slope", "y − y₁ = m(x − x₁)", "You know one point and the slope — the most useful form"],
            ["Two-point", "(y − y₁)/(x − x₁) = (y₂ − y₁)/(x₂ − x₁)", "Two points given"],
            ["Intercept", "x/a + y/b = 1", "The question mentions intercepts on the axes"],
            ["General", "ax + by + c = 0", "Distance formulas need this form"]
          ]
        }
      },

      {
        code: {
          lang: "text", t: "Slopes, and the two relations that get asked",
          lines: [
            { c: "parallel        ->  m1 = m2", w: "" },
            { c: "perpendicular   ->  m1 x m2 = -1", w: "**Slope 2 is perpendicular to slope -1/2. Negative reciprocal.**", hi: true },
            { c: "", w: "" },
            { c: "distance from a point (x0, y0) to ax + by + c = 0:", w: "" },
            { c: "  |a x0 + b y0 + c| / sqrt(a^2 + b^2)", w: "Worth memorising; it appears in circle and triangle questions too.", hi: true },
            { c: "", w: "" },
            { c: "circle centred (h, k) with radius r:", w: "" },
            { c: "  (x - h)^2 + (y - k)^2 = r^2", w: "" },
            { c: "  general form x^2 + y^2 + 2gx + 2fy + c = 0 has centre (-g, -f)", w: "and radius sqrt(g^2 + f^2 - c)." }
          ]
        }
      },

      { trap: "A **vertical** line has undefined slope, not zero. y = 5 is horizontal with slope 0; x = 5 is vertical with no slope at all. Perpendicularity questions involving an axis-parallel line break the m₁m₂ = −1 rule, and that is exactly when they are asked." },

      { h: "The trigonometry that appears" },

      {
        tbl: {
          t: "The table to know cold",
          h: ["θ", "0°", "30°", "45°", "60°", "90°"],
          rows: [
            ["**sin**", "0", "1/2", "1/√2", "√3/2", "1"],
            ["**cos**", "1", "√3/2", "1/√2", "1/2", "0"],
            ["**tan**", "0", "1/√3", "1", "√3", "undefined"]
          ]
        }
      },

      { n: "Read the sine row as 0, 1, 2, 3, 4 each divided by 4 and square-rooted: √0/2, √1/2, √2/2, √3/2, √4/2. Cosine is the same row reversed. Reconstructing it that way takes five seconds and is more reliable than recalling six separate values under pressure.", nt: "How to rebuild the table if it slips" },

      {
        code: {
          lang: "text", t: "The identities that get used",
          lines: [
            { c: "sin^2 + cos^2 = 1", w: "**The one identity worth its weight; the other two derive from it.**", hi: true },
            { c: "1 + tan^2 = sec^2", w: "" },
            { c: "1 + cot^2 = cosec^2", w: "" },
            { c: "", w: "" },
            { c: "tan = sin/cos      cot = 1/tan", w: "" },
            { c: "sec = 1/cos        cosec = 1/sin", w: "The reciprocal names, which questions use to look harder." },
            { c: "", w: "" },
            { c: "sin(90 - x) = cos x     tan(90 - x) = cot x", w: "Complementary angles; turns sin70/cos20 into 1 on sight." }
          ]
        }
      },

      { h: "Heights and distances — one setup, many questions" },

      {
        code: {
          lang: "text", t: "The standard picture and the standard results",
          lines: [
            { c: "Angle of ELEVATION: looking up from the horizontal.", w: "" },
            { c: "Angle of DEPRESSION: looking down from the horizontal.", w: "**They are equal for the same pair of points — alternate angles.**", hi: true },
            { c: "", w: "" },
            { c: "For a tower of height h at horizontal distance d:", w: "" },
            { c: "  tan(angle) = h/d", w: "Almost every question is this line, once or twice." },
            { c: "", w: "" },
            { c: "Results worth carrying:", w: "" },
            { c: "  elevation 45  ->  height = distance", w: "" },
            { c: "  elevation 30  ->  distance = h x sqrt(3)", w: "" },
            { c: "  elevation 60  ->  distance = h / sqrt(3)", w: "" },
            { c: "  so moving from 30 to 60 halves... no: the distance", w: "" },
            { c: "  falls from h*sqrt3 to h/sqrt3, a difference of 2h/sqrt(3).", w: "The classic two-angle question, pre-solved.", hi: true }
          ]
        }
      },

      {
        tryit: {
          t: "Coordinates and a tower",
          task: "(a) Find the area of the triangle with vertices (1,2), (4,6) and (7,2). (b) Find the equation of the line through (2,3) perpendicular to y = 2x + 1. (c) The angle of elevation of a tower's top is 30° from a point, and 60° from a point 40 m nearer. Find the tower's height.",
          hint: "(a) use the area formula, or spot the base. (b) negative reciprocal slope. (c) two equations in tan.",
          sol: { lang: "text", code: "(a) (1,2) and (7,2) share y, so the base is 6 and the height is 4\n    area = 1/2 x 6 x 4 = 12 sq units\n\n(b) slope of the given line is 2, so the perpendicular slope is -1/2\n    y - 3 = -1/2 (x - 2)  ->  x + 2y = 8\n\n(c) let the height be h and the nearer distance be d\n    tan60 = h/d       ->  d = h/sqrt3\n    tan30 = h/(d+40)  ->  d + 40 = h x sqrt3\n    h sqrt3 - h/sqrt3 = 40\n    h(3 - 1)/sqrt3 = 40  ->  h = 20 sqrt3 = 34.64 m" },
          w: "Part (a) is a reminder to look at the coordinates before reaching for the formula — two points sharing a y-value hand you a horizontal base and turn a three-term formula into a one-line answer."
        }
      }
    ],
    k: [
      "Section formula cross-pairs: m multiplies the SECOND point's coordinate.",
      "Area zero from three vertices means the points are collinear.",
      "Perpendicular slopes multiply to −1; vertical lines have undefined slope.",
      "Distance from a point to a line is |ax₀+by₀+c|/√(a²+b²).",
      "Rebuild the trig table as √0/2 … √4/2 for sine, reversed for cosine.",
      "Angles of elevation and depression between the same two points are equal.",
      "At 45° elevation, height equals horizontal distance."
    ],
    r: ["Euclidean Distance", "Vector"],
    drill: {
      lang: "text",
      reps: 3,
      items: [
        { c: "perpendicular lines: m1 x m2 = -1", w: "negative reciprocal slopes" },
        { c: "area = 1/2 |x1(y2-y3) + x2(y3-y1) + x3(y1-y2)|", w: "zero means collinear" },
        { c: "tan(angle) = height / horizontal distance", w: "every heights-and-distances question" }
      ]
    }
  }

]);
