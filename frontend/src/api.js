const STORAGE_KEY = 'aurelia-local-db-v1'

const defaultDb = {
  admins: [{ _id: 'admin-1', name: 'Aurelia Admin', email: 'admin@aurelia.com', password: 'admin123' }],
  products: [
    { _id: 'p1', name: 'Celeste Diamond Halo Ring', categoryName: 'Rings', price: 2890, rating: 5, image: '/products/celeste-diamond-halo-ring.jpg', description: 'Signature halo ring.', featured: true, newArrival: true, premiumCollection: true, sortOrder: 1, status: 'Active', isVisible: true },
    { _id: 'p2', name: 'Regalia Pear Pendant', categoryName: 'Necklaces', price: 2460, rating: 4, image: '/products/regalia-pear-pendant.jpg', description: 'Pear-cut pendant.', featured: false, newArrival: true, premiumCollection: true, sortOrder: 2, status: 'Active', isVisible: true },
    { _id: 'p3', name: 'Solara Stud Earrings', categoryName: 'Earrings', price: 1980, rating: 5, image: '/products/solara-stud-earrings.jpg', description: 'Elegant daily wear studs.', featured: true, newArrival: false, premiumCollection: false, sortOrder: 3, status: 'Active', isVisible: true },
    { _id: 'p4', name: 'Eterna Tennis Bracelet', categoryName: 'Bracelets', price: 3190, rating: 5, image: '/products/eterna-tennis-bracelet.jpg', description: 'Classic bracelet line.', featured: true, newArrival: false, premiumCollection: true, sortOrder: 4, status: 'Active', isVisible: true },
    { _id: 'p5', name: 'Noir Luxe Bridal Set', categoryName: 'Bridal Collection', price: 4590, rating: 5, image: '/products/noir-luxe-bridal-set.jpg', description: 'Luxury bridal set.', featured: true, newArrival: true, premiumCollection: true, sortOrder: 5, status: 'Active', isVisible: true },
    { _id: 'p6', name: 'Auric Promise Band', categoryName: 'Rings', price: 1740, rating: 4, image: '/products/auric-promise-band.jpg', description: 'Minimal promise band.', featured: false, newArrival: true, premiumCollection: false, sortOrder: 6, status: 'Active', isVisible: true }
  ],
  categories: [
    { _id: 'c1', name: 'Rings', icon: 'Gem', isVisible: true, sortOrder: 1 },
    { _id: 'c2', name: 'Necklaces', icon: 'Crown', isVisible: true, sortOrder: 2 },
    { _id: 'c3', name: 'Earrings', icon: 'Sparkles', isVisible: true, sortOrder: 3 },
    { _id: 'c4', name: 'Bracelets', icon: 'Link2', isVisible: true, sortOrder: 4 },
    { _id: 'c5', name: 'Bridal Collection', icon: 'Award', isVisible: true, sortOrder: 5 }
  ],
  homepage: {
    heroTitle: 'Timeless Jewellery',
    heroSubtitle: 'Discover handcrafted heirloom pieces in ethically sourced gold and diamonds, designed to celebrate every precious chapter of your story.',
    heroButtonText: 'Shop Collection',
    heroImageDark: '/waterheroimage1.jpg',
    heroImageLight: '/waterheroimage2.jpg',
    featuredSectionTitle: 'Featured Categories',
    newArrivalsSectionTitle: 'Curated New Arrivals',
    bannerText: 'Premium Collection',
    premiumTitle: 'The Imperial Heirloom Edit',
    premiumSubtitle: 'Limited-edition masterpieces with rare cuts, bespoke settings, and ceremonial elegance for extraordinary moments.'
  },
  settings: {
    businessEmail: 'care@aureliajewels.com',
    phone: '+1 (212) 555-0188',
    address: 'Fifth Avenue, New York',
    footerDescription: 'Fine jewellery crafted with timeless artistry and modern luxury.',
    quickLinksText: ['Home', 'Collections', 'New Arrivals', 'About', 'Contact'],
    instagram: '',
    facebook: '',
    pinterest: '',
    whatsapp: '',
    youtube: ''
  },
  testimonials: [
    { _id: 't1', customerName: 'Ananya Rao', reviewText: 'The finishing is extraordinary. My bracelet feels like couture on the wrist.', rating: 5, role: 'Mumbai', isVisible: true },
    { _id: 't2', customerName: 'Sophia Grant', reviewText: 'Luxurious packaging, flawless quality, and impeccable craftsmanship.', rating: 5, role: 'New York', isVisible: true },
    { _id: 't3', customerName: 'Ishita Malhotra', reviewText: 'Aurelia has become my go-to for milestone jewellery pieces.', rating: 5, role: 'Delhi', isVisible: true }
  ],
  whyChooseUs: [
    { _id: 'w1', title: 'Certified Quality', description: 'BIS hallmarked gold and conflict-free certified diamonds.', icon: 'ShieldCheck', isVisible: true },
    { _id: 'w2', title: 'Premium Craftsmanship', description: 'Master artisans sculpt every piece with obsessive precision.', icon: 'Gem', isVisible: true },
    { _id: 'w3', title: 'Lifetime Shine', description: 'Complimentary polishing and care support for timeless brilliance.', icon: 'Sparkles', isVisible: true },
    { _id: 'w4', title: 'Secure Shopping', description: 'Encrypted checkout and insured shipping on every order.', icon: 'ShoppingBag', isVisible: true }
  ],
  inquiries: [],
  newsletters: [],
  favoritesByUser: {}
}

const makeId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

function readDb() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!parsed || typeof parsed !== 'object') return { ...defaultDb }
    return {
      ...defaultDb,
      ...parsed,
      admins: Array.isArray(parsed.admins) && parsed.admins.length ? parsed.admins : defaultDb.admins,
      products: Array.isArray(parsed.products) && parsed.products.length ? parsed.products : defaultDb.products,
      categories: Array.isArray(parsed.categories) && parsed.categories.length ? parsed.categories : defaultDb.categories,
      testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : defaultDb.testimonials,
      whyChooseUs: Array.isArray(parsed.whyChooseUs) ? parsed.whyChooseUs : defaultDb.whyChooseUs,
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
      newsletters: Array.isArray(parsed.newsletters) ? parsed.newsletters : [],
      favoritesByUser: parsed.favoritesByUser && typeof parsed.favoritesByUser === 'object' ? parsed.favoritesByUser : {}
    }
  } catch {
    return { ...defaultDb }
  }
}

function writeDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function getAdminFromToken(token) {
  if (!token || !token.startsWith('local-admin-token:')) return null
  const email = token.split(':')[1]
  if (!email) return null
  const db = readDb()
  return db.admins.find((a) => String(a.email).toLowerCase() === String(email).toLowerCase()) || null
}

function requireAdmin(token) {
  const admin = getAdminFromToken(token)
  if (!admin) throw new Error('Unauthorized')
  return admin
}

function toPublicProducts(items) {
  return items
    .filter((p) => p.isVisible !== false && String(p.status || 'Active').toLowerCase() === 'active')
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
}

function toPublicTestimonials(items) {
  return items.filter((t) => t.isVisible !== false)
}

function toPublicWhy(items) {
  return items.filter((w) => w.isVisible !== false)
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Unable to read image file'))
    reader.readAsDataURL(file)
  })
}

const asyncResolve = (value) => Promise.resolve(clone(value))

export const api = {
  auth: {
    adminLogin: async ({ email, password }) => {
      const db = readDb()
      const admin = db.admins.find((a) => String(a.email).toLowerCase() === String(email || '').toLowerCase())
      if (!admin || String(admin.password) !== String(password || '')) throw new Error('Invalid admin credentials')
      return asyncResolve({
        token: `local-admin-token:${admin.email.toLowerCase()}`,
        user: { _id: admin._id, name: admin.name, email: admin.email, role: 'admin' }
      })
    },
    me: async (token) => {
      const admin = requireAdmin(token)
      return asyncResolve({ _id: admin._id, name: admin.name, email: admin.email, role: 'admin' })
    }
  },

  dashboard: {
    get: async (token) => {
      requireAdmin(token)
      const db = readDb()
      const unreadInquiries = db.inquiries.filter((i) => !i.isRead).length
      return asyncResolve({
        totalProducts: db.products.length,
        totalCategories: db.categories.length,
        totalTestimonials: db.testimonials.length,
        totalWhyChooseUs: db.whyChooseUs.length,
        totalInquiries: db.inquiries.length,
        unreadInquiries
      })
    }
  },

  profile: {
    getAdmin: async (token) => {
      const admin = requireAdmin(token)
      return asyncResolve({ _id: admin._id, name: admin.name, email: admin.email })
    },
    updateAdmin: async (token, payload) => {
      const admin = requireAdmin(token)
      const db = readDb()
      const idx = db.admins.findIndex((a) => a._id === admin._id)
      if (idx < 0) throw new Error('Admin not found')
      const currentPassword = String(payload.currentPassword || '')
      const newPassword = String(payload.newPassword || '')
      if (newPassword && currentPassword !== String(db.admins[idx].password || '')) throw new Error('Current password is incorrect')
      db.admins[idx] = {
        ...db.admins[idx],
        name: String(payload.name || db.admins[idx].name).trim(),
        email: String(payload.email || db.admins[idx].email).trim(),
        password: newPassword ? newPassword : db.admins[idx].password
      }
      writeDb(db)
      return asyncResolve({ _id: db.admins[idx]._id, name: db.admins[idx].name, email: db.admins[idx].email })
    },
    getCustomer: async () => asyncResolve({}),
    updateCustomer: async (_token, payload) => asyncResolve(payload || {})
  },

  products: {
    list: async (admin = false) => {
      const db = readDb()
      return asyncResolve(admin ? db.products : toPublicProducts(db.products))
    },
    create: async (token, payload) => {
      requireAdmin(token)
      const db = readDb()
      const created = {
        _id: makeId('p'),
        name: String(payload.name || '').trim(),
        categoryName: String(payload.categoryName || 'Rings'),
        price: Number(payload.price || 0),
        rating: Number(payload.rating || 5),
        image: String(payload.image || ''),
        description: String(payload.description || ''),
        highlight: String(payload.highlight || ''),
        material: String(payload.material || ''),
        occasion: String(payload.occasion || ''),
        featured: !!payload.featured,
        newArrival: payload.newArrival !== false,
        premiumCollection: !!payload.premiumCollection,
        sortOrder: Number(payload.sortOrder || db.products.length + 1),
        status: String(payload.status || 'Active'),
        isVisible: payload.isVisible !== false
      }
      db.products.push(created)
      writeDb(db)
      return asyncResolve(created)
    },
    update: async (token, id, payload) => {
      requireAdmin(token)
      const db = readDb()
      const idx = db.products.findIndex((p) => String(p._id || p.id) === String(id))
      if (idx < 0) throw new Error('Product not found')
      db.products[idx] = { ...db.products[idx], ...payload, _id: db.products[idx]._id }
      writeDb(db)
      return asyncResolve(db.products[idx])
    },
    remove: async (token, id) => {
      requireAdmin(token)
      const db = readDb()
      db.products = db.products.filter((p) => String(p._id || p.id) !== String(id))
      writeDb(db)
      return asyncResolve({ success: true })
    }
  },

  categories: {
    list: async (admin = false) => {
      const db = readDb()
      const items = admin ? db.categories : db.categories.filter((c) => c.isVisible !== false)
      return asyncResolve(items.sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)))
    },
    create: async (token, payload) => {
      requireAdmin(token)
      const db = readDb()
      const created = { _id: makeId('c'), name: String(payload.name || '').trim(), icon: String(payload.icon || 'Gem'), isVisible: payload.isVisible !== false, sortOrder: Number(payload.sortOrder || 0) }
      db.categories.push(created)
      writeDb(db)
      return asyncResolve(created)
    },
    update: async (token, id, payload) => {
      requireAdmin(token)
      const db = readDb()
      const idx = db.categories.findIndex((c) => c._id === id)
      if (idx < 0) throw new Error('Category not found')
      db.categories[idx] = { ...db.categories[idx], ...payload, _id: db.categories[idx]._id }
      writeDb(db)
      return asyncResolve(db.categories[idx])
    },
    remove: async (token, id) => {
      requireAdmin(token)
      const db = readDb()
      db.categories = db.categories.filter((c) => c._id !== id)
      writeDb(db)
      return asyncResolve({ success: true })
    }
  },

  homepage: {
    get: async () => asyncResolve(readDb().homepage),
    update: async (token, payload) => {
      requireAdmin(token)
      const db = readDb()
      db.homepage = { ...db.homepage, ...payload }
      writeDb(db)
      return asyncResolve(db.homepage)
    }
  },

  settings: {
    get: async () => asyncResolve(readDb().settings),
    update: async (token, payload) => {
      requireAdmin(token)
      const db = readDb()
      db.settings = { ...db.settings, ...payload }
      writeDb(db)
      return asyncResolve(db.settings)
    }
  },

  inquiries: {
    create: async (payload) => {
      const db = readDb()
      const created = {
        _id: makeId('i'),
        name: String(payload.name || '').trim(),
        email: String(payload.email || '').trim(),
        message: String(payload.message || '').trim(),
        isRead: false,
        createdAt: new Date().toISOString()
      }
      db.inquiries.unshift(created)
      writeDb(db)
      return asyncResolve(created)
    },
    list: async (token) => {
      requireAdmin(token)
      return asyncResolve(readDb().inquiries)
    },
    markRead: async (token, id, isRead) => {
      requireAdmin(token)
      const db = readDb()
      const idx = db.inquiries.findIndex((i) => i._id === id)
      if (idx < 0) throw new Error('Inquiry not found')
      db.inquiries[idx].isRead = !!isRead
      writeDb(db)
      return asyncResolve(db.inquiries[idx])
    },
    remove: async (token, id) => {
      requireAdmin(token)
      const db = readDb()
      db.inquiries = db.inquiries.filter((i) => i._id !== id)
      writeDb(db)
      return asyncResolve({ success: true })
    }
  },

  testimonials: {
    list: async (admin = false) => {
      const db = readDb()
      return asyncResolve(admin ? db.testimonials : toPublicTestimonials(db.testimonials))
    },
    create: async (token, payload) => {
      requireAdmin(token)
      const db = readDb()
      const created = {
        _id: makeId('t'),
        customerName: String(payload.customerName || '').trim(),
        reviewText: String(payload.reviewText || '').trim(),
        rating: Number(payload.rating || 5),
        role: String(payload.role || '').trim(),
        isVisible: payload.isVisible !== false
      }
      db.testimonials.unshift(created)
      writeDb(db)
      return asyncResolve(created)
    },
    update: async (token, id, payload) => {
      requireAdmin(token)
      const db = readDb()
      const idx = db.testimonials.findIndex((t) => t._id === id)
      if (idx < 0) throw new Error('Testimonial not found')
      db.testimonials[idx] = { ...db.testimonials[idx], ...payload, _id: db.testimonials[idx]._id }
      writeDb(db)
      return asyncResolve(db.testimonials[idx])
    },
    remove: async (token, id) => {
      requireAdmin(token)
      const db = readDb()
      db.testimonials = db.testimonials.filter((t) => t._id !== id)
      writeDb(db)
      return asyncResolve({ success: true })
    }
  },

  whyChooseUs: {
    list: async (admin = false) => {
      const db = readDb()
      return asyncResolve(admin ? db.whyChooseUs : toPublicWhy(db.whyChooseUs))
    },
    create: async (token, payload) => {
      requireAdmin(token)
      const db = readDb()
      const created = {
        _id: makeId('w'),
        title: String(payload.title || '').trim(),
        description: String(payload.description || '').trim(),
        icon: String(payload.icon || 'Gem'),
        isVisible: payload.isVisible !== false
      }
      db.whyChooseUs.unshift(created)
      writeDb(db)
      return asyncResolve(created)
    },
    update: async (token, id, payload) => {
      requireAdmin(token)
      const db = readDb()
      const idx = db.whyChooseUs.findIndex((w) => w._id === id)
      if (idx < 0) throw new Error('Card not found')
      db.whyChooseUs[idx] = { ...db.whyChooseUs[idx], ...payload, _id: db.whyChooseUs[idx]._id }
      writeDb(db)
      return asyncResolve(db.whyChooseUs[idx])
    },
    remove: async (token, id) => {
      requireAdmin(token)
      const db = readDb()
      db.whyChooseUs = db.whyChooseUs.filter((w) => w._id !== id)
      writeDb(db)
      return asyncResolve({ success: true })
    }
  },

  newsletter: {
    subscribe: async (payload) => {
      const db = readDb()
      const email = String(payload.email || '').trim().toLowerCase()
      if (!email) throw new Error('Email is required')
      const exists = db.newsletters.some((n) => String(n.email).toLowerCase() === email)
      if (exists) throw new Error('This email is already subscribed')
      db.newsletters.push({ _id: makeId('n'), email, createdAt: new Date().toISOString() })
      writeDb(db)
      return asyncResolve({ success: true })
    }
  },

  favorites: {
    list: async (token) => {
      const user = token || 'guest'
      const db = readDb()
      return asyncResolve(db.favoritesByUser[user] || [])
    },
    add: async (token, productId) => {
      const user = token || 'guest'
      const db = readDb()
      const current = new Set(db.favoritesByUser[user] || [])
      current.add(String(productId))
      db.favoritesByUser[user] = [...current]
      writeDb(db)
      return asyncResolve({ success: true })
    },
    remove: async (token, productId) => {
      const user = token || 'guest'
      const db = readDb()
      db.favoritesByUser[user] = (db.favoritesByUser[user] || []).filter((id) => String(id) !== String(productId))
      writeDb(db)
      return asyncResolve({ success: true })
    }
  },

  upload: {
    image: async (token, file) => {
      requireAdmin(token)
      if (!file) throw new Error('No file selected')
      const dataUrl = await fileToDataUrl(file)
      return asyncResolve({ path: dataUrl })
    }
  }
}
