import { useEffect, useMemo, useState } from 'react'
import { api } from './api'
import {
  Award,
  Crown,
  Gem,
  Heart,
  Link2,
  Mail,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  X
} from 'lucide-react'

const brandName = 'Kriscel Jewels'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Collections', href: '#collections' },
  { label: 'New Arrivals', href: '#products' },
  { label: 'Best Sellers', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' }
]

const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bridal Collection']

const featuredCategories = [
  { name: 'Rings', icon: Gem },
  { name: 'Necklaces', icon: Crown },
  { name: 'Earrings', icon: Sparkles },
  { name: 'Bracelets', icon: Link2 },
  { name: 'Bridal Collection', icon: Award }
]

const initialProducts = [
  { id: 1, name: 'Celeste Diamond Halo Ring', category: 'Rings', price: 2890, rating: 5, image: '/products/celeste-diamond-halo-ring.jpg' },
  { id: 2, name: 'Regalia Pear Pendant', category: 'Necklaces', price: 2460, rating: 4, image: '/products/regalia-pear-pendant.jpg' },
  { id: 3, name: 'Solara Stud Earrings', category: 'Earrings', price: 1980, rating: 5, image: '/products/solara-stud-earrings.jpg' },
  { id: 4, name: 'Eterna Tennis Bracelet', category: 'Bracelets', price: 3190, rating: 5, image: '/products/eterna-tennis-bracelet.jpg' },
  { id: 5, name: 'Noir Luxe Bridal Set', category: 'Bridal Collection', price: 4590, rating: 5, image: '/products/noir-luxe-bridal-set.jpg' },
  { id: 6, name: 'Auric Promise Band', category: 'Rings', price: 1740, rating: 4, image: '/products/auric-promise-band.jpg' }
]

const fallbackProductImage = '/products/celeste-diamond-halo-ring.jpg'
const normalizeImagePath = (value) => {
  const v = String(value || '').trim()
  if (!v) return fallbackProductImage
  if (v.startsWith('data:image/')) return v
  if (v.startsWith('http://') || v.startsWith('https://')) return v
  if (v.startsWith('/')) return v
  return `/${v.replace(/^\/+/, '')}`
}

const whyChooseUs = [
  { title: 'Certified Quality', detail: 'BIS hallmarked gold and conflict-free certified diamonds.', icon: ShieldCheck },
  { title: 'Premium Craftsmanship', detail: 'Master artisans sculpt every piece with obsessive precision.', icon: Gem },
  { title: 'Lifetime Shine', detail: 'Complimentary polishing and care support for timeless brilliance.', icon: Sparkles },
  { title: 'Secure Shopping', detail: 'Encrypted checkout and insured shipping on every order.', icon: ShoppingBag }
]

const testimonials = [
  { name: 'Ananya Rao', text: 'The finishing is extraordinary. My bracelet feels like couture on the wrist.', role: 'Mumbai' },
  { name: 'Sophia Grant', text: 'Luxurious packaging, flawless quality, and impeccable craftsmanship.', role: 'New York' },
  { name: 'Ishita Malhotra', text: 'Kriscel has become my go-to for milestone jewellery pieces.', role: 'Delhi' }
]

function App() {
  const [products, setProducts] = useState(initialProducts)
  const [categoriesData, setCategoriesData] = useState([])
  const [content, setContent] = useState(null)
  const [contactSettings, setContactSettings] = useState(null)
  const [testimonialsData, setTestimonialsData] = useState([])
  const [whyChooseUsData, setWhyChooseUsData] = useState([])
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('aurelia-token') || '')
  const [wishlist, setWishlist] = useState({})
  const [mobileMenu, setMobileMenu] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState('')
  const [authRole, setAuthRole] = useState(() => localStorage.getItem('aurelia-role') || '')
  const [authEmail, setAuthEmail] = useState(() => localStorage.getItem('aurelia-user-email') || '')
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [adminMsg, setAdminMsg] = useState('')
  const [dashboardStats, setDashboardStats] = useState(null)
  const [inquiries, setInquiries] = useState([])
  const [inquirySearch, setInquirySearch] = useState('')
  const [adminProfileForm, setAdminProfileForm] = useState({ name: '', email: '', currentPassword: '', newPassword: '' })
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: 'Gem', isVisible: true, sortOrder: 0 })
  const [homepageForm, setHomepageForm] = useState({})
  const [settingsForm, setSettingsForm] = useState({})
  const [testimonialForm, setTestimonialForm] = useState({ customerName: '', reviewText: '', rating: 5, role: '', isVisible: true })
  const [whyForm, setWhyForm] = useState({ title: '', description: '', icon: 'Gem', isVisible: true })
  const [editingId, setEditingId] = useState(null)
  const [adminForm, setAdminForm] = useState({
    name: '',
    category: 'Rings',
    price: '',
    rating: 5,
    image: '',
    description: '',
    highlight: '',
    material: '',
    occasion: '',
    featured: false,
    newArrival: true,
    premiumCollection: false,
    sortOrder: 1,
    status: 'Active',
    isVisible: true
  })
  const [adminEditForm, setAdminEditForm] = useState({
    name: '',
    category: 'Rings',
    price: '',
    rating: 5,
    image: '',
    description: '',
    highlight: '',
    material: '',
    occasion: '',
    featured: false,
    newArrival: true,
    premiumCollection: false,
    sortOrder: 1,
    status: 'Active',
    isVisible: true
  })

  const isDark = false
  const heroVideo = '/hero-video.mp4'

  useEffect(() => {
    if (!authRole) return
    localStorage.setItem('aurelia-role', authRole)
    localStorage.setItem('aurelia-user-email', authEmail)
  }, [authRole, authEmail])

  useEffect(() => {
    if (!authToken) return
    localStorage.setItem('aurelia-token', authToken)
  }, [authToken])

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const [productsRes, categoriesRes, homepageRes, settingsRes, testimonialsRes, whyRes] = await Promise.all([
          api.products.list(authRole === 'admin'),
          api.categories.list(authRole === 'admin'),
          api.homepage.get(),
          api.settings.get(),
          api.testimonials.list(authRole === 'admin'),
          api.whyChooseUs.list(authRole === 'admin')
        ])
        const resolvedProducts = (productsRes.length ? productsRes : initialProducts).map((p) => ({
          ...p,
          image: normalizeImagePath(p.image)
        }))
        setProducts(resolvedProducts)
        setCategoriesData(categoriesRes)
        setContent(homepageRes)
        setContactSettings(settingsRes)
        setHomepageForm(homepageRes)
        setSettingsForm({ ...settingsRes, quickLinksText: (settingsRes.quickLinksText || []).join(', ') })
        setTestimonialsData(testimonialsRes)
        setWhyChooseUsData(whyRes)
      } catch {
        setProducts(initialProducts)
      }
    }
    loadPublicData()
  }, [authRole])

  useEffect(() => {
    if (authRole !== 'admin' || !authToken) return
    const loadAdminData = async () => {
      try {
        const [stats, profile, inquiryList] = await Promise.all([
          api.dashboard.get(authToken),
          api.profile.getAdmin(authToken),
          api.inquiries.list(authToken)
        ])
        setDashboardStats(stats)
        setInquiries(inquiryList)
        setAdminProfileForm((prev) => ({ ...prev, name: profile.name || '', email: profile.email || '' }))
      } catch {}
    }
    loadAdminData()
  }, [authRole, authToken])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.zoom-section'))
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [authRole, showAdminLogin])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const categoryMatch = activeCategory === 'All' || (p.categoryName || p.category) === activeCategory
      const searchMatch = `${p.name} ${p.categoryName || p.category}`.toLowerCase().includes(search.toLowerCase())
      return categoryMatch && searchMatch
    })
  }, [products, activeCategory, search])

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const onNewsletterSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    api.newsletter.subscribe({ email: email.trim() })
      .then(() => {
        setSuccess('Thank you for subscribing. Exclusive launches are now on their way to your inbox.')
        setEmail('')
        setTimeout(() => setSuccess(''), 5000)
      })
      .catch((err) => setSuccess(err.message))
  }

  const onLoginSubmit = async (e) => {
    e.preventDefault()
    const normalizedEmail = loginEmail.trim().toLowerCase()
    const normalizedPassword = loginPassword.trim()
    if (!normalizedEmail || !normalizedPassword) {
      setLoginError('Please enter email and password.')
      return
    }
    try {
      const res = await api.auth.adminLogin({ email: normalizedEmail, password: normalizedPassword })
      setAuthToken(res.token)
      setAuthRole('admin')
      setAuthEmail(res.user.email)
      setShowAdminLogin(false)
      setLoginError('')
      setLoginPassword('')
    } catch (err) {
      setLoginError(err.message || 'Login failed')
    }
  }

  const onLogout = () => {
    setAuthRole('')
    setAuthEmail('')
    setAuthToken('')
    localStorage.removeItem('aurelia-role')
    localStorage.removeItem('aurelia-user-email')
    localStorage.removeItem('aurelia-token')
    setShowAdminLogin(false)
  }

  const clearAdminMessage = () => {
    setTimeout(() => setAdminMsg(''), 2500)
  }

  const onAdminAddProduct = async (e) => {
    e.preventDefault()
    const name = adminForm.name.trim()
    const image = adminForm.image.trim()
    const price = Number(adminForm.price)
    const rating = Number(adminForm.rating)
    if (!name || !image || !price) {
      setAdminMsg('Fill all required product fields.')
      clearAdminMessage()
      return
    }
    if (!authToken) return
    const payload = {
      name,
      categoryName: adminForm.category,
      price,
      rating: Math.max(1, Math.min(5, rating)),
      image,
      description: adminForm.description,
      highlight: adminForm.highlight,
      material: adminForm.material,
      occasion: adminForm.occasion,
      featured: adminForm.featured,
      newArrival: adminForm.newArrival,
      premiumCollection: adminForm.premiumCollection,
      sortOrder: Number(adminForm.sortOrder || products.length + 1),
      status: adminForm.status,
      isVisible: adminForm.isVisible
    }
    const created = await api.products.create(authToken, payload)
    setProducts((prev) => [...prev, created])
    setAdminForm({ name: '', category: 'Rings', price: '', rating: 5, image: '', description: '', highlight: '', material: '', occasion: '', featured: false, newArrival: true, premiumCollection: false, sortOrder: products.length + 2, status: 'Active', isVisible: true })
    setAdminMsg('Product added successfully.')
    clearAdminMessage()
  }

  const onAdminDeleteProduct = async (id) => {
    if (!authToken) return
    if (!window.confirm('Delete this product?')) return
    await api.products.remove(authToken, id)
    setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id))
    setWishlist((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    setAdminMsg('Product removed.')
    clearAdminMessage()
  }

  const startAdminEdit = (product) => {
    setEditingId(product._id || product.id)
    setAdminEditForm({
      name: product.name,
      category: product.categoryName || product.category,
      price: String(product.price),
      rating: product.rating,
      image: product.image,
      description: product.description || '',
      highlight: product.highlight || '',
      material: product.material || '',
      occasion: product.occasion || '',
      featured: !!product.featured,
      newArrival: !!product.newArrival,
      premiumCollection: !!product.premiumCollection,
      sortOrder: product.sortOrder || 1,
      status: product.status || 'Active',
      isVisible: product.isVisible !== false
    })
  }

  const saveAdminEdit = async (id) => {
    const name = adminEditForm.name.trim()
    const image = adminEditForm.image.trim()
    const price = Number(adminEditForm.price)
    const rating = Number(adminEditForm.rating)
    if (!name || !image || !price) {
      setAdminMsg('Edit fields cannot be empty.')
      clearAdminMessage()
      return
    }
    if (!authToken) return
    const updated = await api.products.update(authToken, id, {
      name,
      categoryName: adminEditForm.category,
      price,
      rating: Math.max(1, Math.min(5, rating)),
      image,
      description: adminEditForm.description,
      highlight: adminEditForm.highlight,
      material: adminEditForm.material,
      occasion: adminEditForm.occasion,
      featured: adminEditForm.featured,
      newArrival: adminEditForm.newArrival,
      premiumCollection: adminEditForm.premiumCollection,
      sortOrder: Number(adminEditForm.sortOrder || 1),
      status: adminEditForm.status,
      isVisible: adminEditForm.isVisible
    })
    setProducts((prev) => prev.map((p) => ((p._id || p.id) === id ? updated : p)))
    setEditingId(null)
    setAdminMsg('Product updated.')
    clearAdminMessage()
  }

  const totalInventoryValue = useMemo(() => products.reduce((sum, p) => sum + Number(p.price || 0), 0), [products])
  const categoryFilters = useMemo(() => ['All', ...categoriesData.filter((c) => c.isVisible !== false).map((c) => c.name)], [categoriesData])
  const filteredInquiries = useMemo(() => {
    if (!inquirySearch.trim()) return inquiries
    const q = inquirySearch.toLowerCase()
    return inquiries.filter((i) => `${i.name} ${i.email} ${i.message}`.toLowerCase().includes(q))
  }, [inquiries, inquirySearch])

  const onAdminProfileSave = async (e) => {
    e.preventDefault()
    if (!authToken) return
    try {
      await api.profile.updateAdmin(authToken, adminProfileForm)
      setAdminMsg('Admin profile updated.')
      clearAdminMessage()
      setAdminProfileForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }))
    } catch (err) {
      setAdminMsg(err.message)
      clearAdminMessage()
    }
  }

  const onToggleInquiryRead = async (id, isRead) => {
    if (!authToken) return
    await api.inquiries.markRead(authToken, id, !isRead)
    setInquiries((prev) => prev.map((i) => (i._id === id ? { ...i, isRead: !isRead } : i)))
  }

  const onDeleteInquiry = async (id) => {
    if (!authToken) return
    if (!window.confirm('Delete this inquiry?')) return
    await api.inquiries.remove(authToken, id)
    setInquiries((prev) => prev.filter((i) => i._id !== id))
  }

  const onUploadProductImage = async (file, mode = 'add') => {
    if (!file || !authToken) return
    const uploaded = await api.upload.image(authToken, file)
    if (mode === 'add') setAdminForm((prev) => ({ ...prev, image: uploaded.path }))
    else setAdminEditForm((prev) => ({ ...prev, image: uploaded.path }))
    setAdminMsg('Image uploaded successfully.')
    clearAdminMessage()
  }

  const onAddCategory = async (e) => {
    e.preventDefault()
    if (!authToken || !categoryForm.name.trim()) return
    const created = await api.categories.create(authToken, { ...categoryForm, name: categoryForm.name.trim(), sortOrder: Number(categoryForm.sortOrder || 0) })
    setCategoriesData((prev) => [...prev, created])
    setCategoryForm({ name: '', icon: 'Gem', isVisible: true, sortOrder: 0 })
  }

  const onCategoryUpdate = async (id, patch) => {
    if (!authToken) return
    const updated = await api.categories.update(authToken, id, patch)
    setCategoriesData((prev) => prev.map((c) => (c._id === id ? updated : c)))
  }

  const onCategoryDelete = async (id) => {
    if (!authToken || !window.confirm('Delete this category?')) return
    await api.categories.remove(authToken, id)
    setCategoriesData((prev) => prev.filter((c) => c._id !== id))
  }

  const onSaveHomepage = async (e) => {
    e.preventDefault()
    if (!authToken) return
    const updated = await api.homepage.update(authToken, homepageForm)
    setContent(updated)
    setHomepageForm(updated)
    setAdminMsg('Homepage content updated.')
    clearAdminMessage()
  }

  const onSaveSettings = async (e) => {
    e.preventDefault()
    if (!authToken) return
    const payload = { ...settingsForm, quickLinksText: String(settingsForm.quickLinksText || '').split(',').map((x) => x.trim()).filter(Boolean) }
    const updated = await api.settings.update(authToken, payload)
    setContactSettings(updated)
    setSettingsForm({ ...updated, quickLinksText: (updated.quickLinksText || []).join(', ') })
    setAdminMsg('Contact/footer settings updated.')
    clearAdminMessage()
  }

  const onAddTestimonial = async (e) => {
    e.preventDefault()
    if (!authToken || !testimonialForm.customerName.trim() || !testimonialForm.reviewText.trim()) return
    const created = await api.testimonials.create(authToken, testimonialForm)
    setTestimonialsData((prev) => [created, ...prev])
    setTestimonialForm({ customerName: '', reviewText: '', rating: 5, role: '', isVisible: true })
  }

  const onTestimonialUpdate = async (id, patch) => {
    if (!authToken) return
    const updated = await api.testimonials.update(authToken, id, patch)
    setTestimonialsData((prev) => prev.map((t) => (t._id === id ? updated : t)))
  }

  const onTestimonialDelete = async (id) => {
    if (!authToken || !window.confirm('Delete this testimonial?')) return
    await api.testimonials.remove(authToken, id)
    setTestimonialsData((prev) => prev.filter((t) => t._id !== id))
  }

  const onAddWhy = async (e) => {
    e.preventDefault()
    if (!authToken || !whyForm.title.trim() || !whyForm.description.trim()) return
    const created = await api.whyChooseUs.create(authToken, whyForm)
    setWhyChooseUsData((prev) => [created, ...prev])
    setWhyForm({ title: '', description: '', icon: 'Gem', isVisible: true })
  }

  const onWhyUpdate = async (id, patch) => {
    if (!authToken) return
    const updated = await api.whyChooseUs.update(authToken, id, patch)
    setWhyChooseUsData((prev) => prev.map((w) => (w._id === id ? updated : w)))
  }

  const onWhyDelete = async (id) => {
    if (!authToken || !window.confirm('Delete this card?')) return
    await api.whyChooseUs.remove(authToken, id)
    setWhyChooseUsData((prev) => prev.filter((w) => w._id !== id))
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-noir text-ivory' : 'bg-[#fbf6ef] text-[#1f1712]'}`}>
      <header className={`sticky top-0 z-50 border-b backdrop-blur-xl ${isDark ? 'border-white/10 bg-noir/80' : 'border-[#cab08a]/45 bg-[#fbf6ef]/90'}`}>
        <nav className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-5 py-4 md:px-8">
          <a href="#home" className="font-display text-2xl tracking-wide gold-text animate-shine">{brandName}</a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className={`text-sm tracking-wide transition ${isDark ? 'text-ivory/80 hover:text-champagne' : 'text-[#3f3127] hover:text-[#a67b3f]'}`}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {authRole === 'admin' ? (
              <>
                <span className={`hidden rounded-full border px-3 py-1 text-xs uppercase tracking-wider md:inline-flex ${isDark ? 'border-white/20 text-champagne' : 'border-[#cdb188] text-[#8f6733]'}`}>
                  admin
                </span>
                <button
                  onClick={onLogout}
                  className={`rounded-full border px-3 py-2 text-xs uppercase tracking-wider ${isDark ? 'border-white/20 text-ivory/90 hover:border-champagne hover:text-champagne' : 'border-[#cdb188] text-[#5f4326] hover:border-[#ab844e]'}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAdminLogin((v) => !v)}
                className={`rounded-full border px-3 py-2 text-xs uppercase tracking-wider ${isDark ? 'border-white/20 text-ivory/90 hover:border-champagne hover:text-champagne' : 'border-[#cdb188] text-[#5f4326] hover:border-[#ab844e]'}`}
              >
                Login
              </button>
            )}
            <button onClick={() => setMobileMenu((v) => !v)} className={`rounded-full border p-2 md:hidden ${isDark ? 'border-white/20' : 'border-[#cdb188]'}`} aria-label="Toggle menu">
              {mobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {mobileMenu && (
          <div className={`border-t px-6 py-4 md:hidden ${isDark ? 'border-white/10 bg-noir/95' : 'border-[#cab08a]/45 bg-[#fbf6ef]'}`}>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className={`text-sm ${isDark ? 'text-ivory/80' : 'text-[#3f3127]'}`} onClick={() => setMobileMenu(false)}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="premium-surface">
        {authRole !== 'admin' && showAdminLogin && (
          <section className="zoom-section mx-auto w-full max-w-[1500px] px-5 pt-8 md:px-8">
            <form onSubmit={onLoginSubmit} className={`mx-auto max-w-xl rounded-3xl border p-6 md:p-8 ${isDark ? 'border-gold/40 bg-[linear-gradient(140deg,#1a120b,#120d09)]' : 'border-[#c9a36b] bg-[linear-gradient(120deg,#fff6e8,#f6e5c8)]'}`}>
              <h2 className="font-display text-3xl">Admin Sign In</h2>
              <div className="mt-4 grid gap-3">
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Admin email" className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony text-ivory' : 'border-[#d8c0a0] bg-white text-[#2b1f15]'}`} />
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter admin password" className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony text-ivory' : 'border-[#d8c0a0] bg-white text-[#2b1f15]'}`} />
              </div>
              {loginError && <p className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{loginError}</p>}
              <button type="submit" className="mt-4 rounded-xl border border-gold bg-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-noir">Login</button>
            </form>
          </section>
        )}
        {authRole === 'admin' && (
          <section className="zoom-section mx-auto w-full max-w-[1500px] px-5 pt-8 md:px-8">
            <div className={`rounded-3xl border p-6 md:p-8 ${isDark ? 'border-gold/40 bg-[linear-gradient(140deg,#1a120b,#120d09)]' : 'border-[#c9a36b] bg-[linear-gradient(120deg,#fff6e8,#f6e5c8)]'}`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-champagne">Admin Control Center</p>
                  <h2 className="mt-2 font-display text-3xl md:text-4xl">Inventory & Catalog Management</h2>
                  <p className={`mt-2 text-sm ${isDark ? 'text-ivory/75' : 'text-[#5a432d]'}`}>Logged in as {authEmail}</p>
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className={`rounded-xl border px-4 py-3 ${isDark ? 'border-white/15 bg-white/5' : 'border-[#d4b288] bg-white/70'}`}>
                    <p className="text-xs uppercase tracking-wider text-champagne">Total Items</p>
                    <p className="mt-1 font-display text-2xl">{dashboardStats?.totalProducts ?? products.length}</p>
                  </div>
                  <div className={`rounded-xl border px-4 py-3 ${isDark ? 'border-white/15 bg-white/5' : 'border-[#d4b288] bg-white/70'}`}>
                    <p className="text-xs uppercase tracking-wider text-champagne">Catalog Value</p>
                    <p className="mt-1 font-display text-2xl">${dashboardStats?.totalCatalogValue ?? totalInventoryValue}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <form onSubmit={onAdminAddProduct} className={`rounded-2xl border p-5 ${isDark ? 'border-white/15 bg-black/20' : 'border-[#d4b288] bg-white/70'}`}>
                  <h3 className="font-display text-2xl">Add Product</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <input value={adminForm.name} onChange={(e) => setAdminForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Product name" className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <select value={adminForm.category} onChange={(e) => setAdminForm((prev) => ({ ...prev, category: e.target.value }))} className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`}>
                      {(categoriesData.length ? categoriesData : categories.filter((c) => c !== 'All').map((c) => ({ name: c }))).map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    <input type="number" min="1" value={adminForm.price} onChange={(e) => setAdminForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="Price (USD)" className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input type="number" min="1" max="5" value={adminForm.rating} onChange={(e) => setAdminForm((prev) => ({ ...prev, rating: e.target.value }))} placeholder="Rating 1-5" className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input value={adminForm.material} onChange={(e) => setAdminForm((prev) => ({ ...prev, material: e.target.value }))} placeholder="Material" className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={adminForm.occasion} onChange={(e) => setAdminForm((prev) => ({ ...prev, occasion: e.target.value }))} placeholder="Occasion" className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={adminForm.highlight} onChange={(e) => setAdminForm((prev) => ({ ...prev, highlight: e.target.value }))} placeholder="Short highlight" className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input type="number" min="1" value={adminForm.sortOrder} onChange={(e) => setAdminForm((prev) => ({ ...prev, sortOrder: e.target.value }))} placeholder="Sort order" className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                  </div>
                  <textarea value={adminForm.description} onChange={(e) => setAdminForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description" className={`mt-3 w-full rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                  <input value={adminForm.image} onChange={(e) => setAdminForm((prev) => ({ ...prev, image: e.target.value }))} placeholder="Image path, e.g. /products/new-item.jpg" className={`mt-3 w-full rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => onUploadProductImage(e.target.files?.[0], 'add')} className={`mt-3 w-full rounded-xl border px-3 py-2 outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-3 file:py-1 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                  <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={adminForm.featured} onChange={(e) => setAdminForm((p) => ({ ...p, featured: e.target.checked }))} /> Featured</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={adminForm.newArrival} onChange={(e) => setAdminForm((p) => ({ ...p, newArrival: e.target.checked }))} /> New Arrival</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={adminForm.premiumCollection} onChange={(e) => setAdminForm((p) => ({ ...p, premiumCollection: e.target.checked }))} /> Premium Collection</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={adminForm.isVisible} onChange={(e) => setAdminForm((p) => ({ ...p, isVisible: e.target.checked }))} /> Visible</label>
                  </div>
                  <select value={adminForm.status} onChange={(e) => setAdminForm((p) => ({ ...p, status: e.target.value }))} className={`mt-3 w-full rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`}>
                    <option value="Active">Active</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                  <button type="submit" className="mt-4 rounded-xl border border-gold bg-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-noir">Add Item</button>
                </form>

                <div className={`rounded-2xl border p-5 ${isDark ? 'border-white/15 bg-black/20' : 'border-[#d4b288] bg-white/70'}`}>
                  <h3 className="font-display text-2xl">Manage Products</h3>
                  <div className="mt-4 max-h-80 space-y-3 overflow-auto pr-1">
                    {products.map((p) => {
                      const productId = p._id || p.id
                      return (
                      <div key={productId} className={`rounded-xl border p-3 ${isDark ? 'border-white/15 bg-ebony/60' : 'border-[#ddc4a4] bg-[#fffaf2]'}`}>
                        {editingId === productId ? (
                          <div className="space-y-2">
                            <input value={adminEditForm.name} onChange={(e) => setAdminEditForm((prev) => ({ ...prev, name: e.target.value }))} className={`w-full rounded-lg border px-3 py-2 ${isDark ? 'border-white/15 bg-noir' : 'border-[#d8c0a0] bg-white'}`} />
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              <select value={adminEditForm.category} onChange={(e) => setAdminEditForm((prev) => ({ ...prev, category: e.target.value }))} className={`rounded-lg border px-3 py-2 ${isDark ? 'border-white/15 bg-noir' : 'border-[#d8c0a0] bg-white'}`}>
                                {(categoriesData.length ? categoriesData : categories.filter((c) => c !== 'All').map((c) => ({ name: c }))).map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                              </select>
                              <input type="number" min="1" value={adminEditForm.price} onChange={(e) => setAdminEditForm((prev) => ({ ...prev, price: e.target.value }))} className={`rounded-lg border px-3 py-2 ${isDark ? 'border-white/15 bg-noir' : 'border-[#d8c0a0] bg-white'}`} />
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              <input type="number" min="1" max="5" value={adminEditForm.rating} onChange={(e) => setAdminEditForm((prev) => ({ ...prev, rating: e.target.value }))} className={`rounded-lg border px-3 py-2 ${isDark ? 'border-white/15 bg-noir' : 'border-[#d8c0a0] bg-white'}`} />
                              <input value={adminEditForm.image} onChange={(e) => setAdminEditForm((prev) => ({ ...prev, image: e.target.value }))} className={`rounded-lg border px-3 py-2 ${isDark ? 'border-white/15 bg-noir' : 'border-[#d8c0a0] bg-white'}`} />
                            </div>
                            <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => onUploadProductImage(e.target.files?.[0], 'edit')} className={`w-full rounded-lg border px-3 py-1.5 text-xs ${isDark ? 'border-white/15 bg-noir' : 'border-[#d8c0a0] bg-white'}`} />
                            <textarea value={adminEditForm.description} onChange={(e) => setAdminEditForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description" className={`w-full rounded-lg border px-3 py-2 ${isDark ? 'border-white/15 bg-noir' : 'border-[#d8c0a0] bg-white'}`} />
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              <input value={adminEditForm.material} onChange={(e) => setAdminEditForm((prev) => ({ ...prev, material: e.target.value }))} placeholder="Material" className={`rounded-lg border px-3 py-2 ${isDark ? 'border-white/15 bg-noir' : 'border-[#d8c0a0] bg-white'}`} />
                              <input value={adminEditForm.occasion} onChange={(e) => setAdminEditForm((prev) => ({ ...prev, occasion: e.target.value }))} placeholder="Occasion" className={`rounded-lg border px-3 py-2 ${isDark ? 'border-white/15 bg-noir' : 'border-[#d8c0a0] bg-white'}`} />
                              <input value={adminEditForm.highlight} onChange={(e) => setAdminEditForm((prev) => ({ ...prev, highlight: e.target.value }))} placeholder="Highlight" className={`rounded-lg border px-3 py-2 ${isDark ? 'border-white/15 bg-noir' : 'border-[#d8c0a0] bg-white'}`} />
                              <input type="number" min="1" value={adminEditForm.sortOrder} onChange={(e) => setAdminEditForm((prev) => ({ ...prev, sortOrder: e.target.value }))} placeholder="Sort order" className={`rounded-lg border px-3 py-2 ${isDark ? 'border-white/15 bg-noir' : 'border-[#d8c0a0] bg-white'}`} />
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                              <label className="flex items-center gap-2"><input type="checkbox" checked={adminEditForm.featured} onChange={(e) => setAdminEditForm((p) => ({ ...p, featured: e.target.checked }))} /> Featured</label>
                              <label className="flex items-center gap-2"><input type="checkbox" checked={adminEditForm.newArrival} onChange={(e) => setAdminEditForm((p) => ({ ...p, newArrival: e.target.checked }))} /> New Arrival</label>
                              <label className="flex items-center gap-2"><input type="checkbox" checked={adminEditForm.premiumCollection} onChange={(e) => setAdminEditForm((p) => ({ ...p, premiumCollection: e.target.checked }))} /> Premium</label>
                              <label className="flex items-center gap-2"><input type="checkbox" checked={adminEditForm.isVisible} onChange={(e) => setAdminEditForm((p) => ({ ...p, isVisible: e.target.checked }))} /> Visible</label>
                            </div>
                            <select value={adminEditForm.status} onChange={(e) => setAdminEditForm((p) => ({ ...p, status: e.target.value }))} className={`w-full rounded-lg border px-3 py-2 ${isDark ? 'border-white/15 bg-noir' : 'border-[#d8c0a0] bg-white'}`}>
                              <option value="Active">Active</option>
                              <option value="Hidden">Hidden</option>
                            </select>
                            <div className="flex gap-2">
                              <button onClick={() => saveAdminEdit(productId)} type="button" className="rounded-lg border border-gold bg-gold px-3 py-1.5 text-xs font-semibold uppercase text-noir">Save</button>
                              <button onClick={() => setEditingId(null)} type="button" className={`rounded-lg border px-3 py-1.5 text-xs uppercase ${isDark ? 'border-white/20' : 'border-[#cdb188]'}`}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium">{p.name}</p>
                              <p className={`text-xs ${isDark ? 'text-ivory/70' : 'text-[#6c5542]'}`}>{p.categoryName || p.category} | ${p.price} | {p.rating} stars</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => startAdminEdit(p)} type="button" className={`rounded-lg border px-3 py-1.5 text-xs uppercase ${isDark ? 'border-white/20' : 'border-[#cdb188]'}`}>Edit</button>
                              <button onClick={() => onAdminDeleteProduct(productId)} type="button" className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-xs uppercase text-red-300">Delete</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )})}
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <form onSubmit={onAdminProfileSave} className={`rounded-2xl border p-5 ${isDark ? 'border-white/15 bg-black/20' : 'border-[#d4b288] bg-white/70'}`}>
                  <h3 className="font-display text-2xl">Admin Profile</h3>
                  <div className="mt-4 grid gap-3">
                    <input value={adminProfileForm.name} onChange={(e) => setAdminProfileForm((p) => ({ ...p, name: e.target.value }))} placeholder="Admin name" className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input type="email" value={adminProfileForm.email} onChange={(e) => setAdminProfileForm((p) => ({ ...p, email: e.target.value }))} placeholder="Admin email" className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input type="password" value={adminProfileForm.currentPassword} onChange={(e) => setAdminProfileForm((p) => ({ ...p, currentPassword: e.target.value }))} placeholder="Current password (required to change password)" className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input type="password" value={adminProfileForm.newPassword} onChange={(e) => setAdminProfileForm((p) => ({ ...p, newPassword: e.target.value }))} placeholder="New password (optional)" className={`rounded-xl border px-3 py-2.5 outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                  </div>
                  <button type="submit" className="mt-4 rounded-xl border border-gold bg-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-noir">Save Profile</button>
                </form>

                <div className={`rounded-2xl border p-5 ${isDark ? 'border-white/15 bg-black/20' : 'border-[#d4b288] bg-white/70'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-2xl">Inquiries</h3>
                    <input value={inquirySearch} onChange={(e) => setInquirySearch(e.target.value)} placeholder="Search inquiry" className={`rounded-xl border px-3 py-2 text-sm outline-none ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                  </div>
                  <div className="mt-4 max-h-80 space-y-3 overflow-auto pr-1">
                    {filteredInquiries.map((item) => (
                      <div key={item._id} className={`rounded-xl border p-3 ${isDark ? 'border-white/15 bg-ebony/60' : 'border-[#ddc4a4] bg-[#fffaf2]'}`}>
                        <p className="text-sm font-medium">{item.name} ({item.email})</p>
                        <p className={`mt-1 text-xs ${isDark ? 'text-ivory/70' : 'text-[#6c5542]'}`}>{item.message}</p>
                        <div className="mt-2 flex gap-2">
                          <button onClick={() => onToggleInquiryRead(item._id, item.isRead)} type="button" className={`rounded-lg border px-3 py-1.5 text-xs uppercase ${isDark ? 'border-white/20' : 'border-[#cdb188]'}`}>{item.isRead ? 'Mark Unread' : 'Mark Read'}</button>
                          <button onClick={() => onDeleteInquiry(item._id)} type="button" className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-1.5 text-xs uppercase text-red-300">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <form onSubmit={onAddCategory} className={`rounded-2xl border p-5 ${isDark ? 'border-white/15 bg-black/20' : 'border-[#d4b288] bg-white/70'}`}>
                  <h3 className="font-display text-2xl">Category Management</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <input value={categoryForm.name} onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))} placeholder="Category name" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={categoryForm.icon} onChange={(e) => setCategoryForm((p) => ({ ...p, icon: e.target.value }))} placeholder="Icon (Gem/Crown/...)" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input type="number" value={categoryForm.sortOrder} onChange={(e) => setCategoryForm((p) => ({ ...p, sortOrder: e.target.value }))} placeholder="Sort order" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={categoryForm.isVisible} onChange={(e) => setCategoryForm((p) => ({ ...p, isVisible: e.target.checked }))} /> Visible</label>
                  </div>
                  <button type="submit" className="mt-4 rounded-xl border border-gold bg-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-noir">Add Category</button>
                  <div className="mt-4 max-h-44 space-y-2 overflow-auto pr-1">
                    {categoriesData.map((c) => (
                      <div key={c._id} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${isDark ? 'border-white/15' : 'border-[#d8c0a0]'}`}>
                        <span className="text-sm">{c.name} ({c.icon || 'Gem'})</span>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => onCategoryUpdate(c._id, { isVisible: !c.isVisible })} className={`rounded-lg border px-2 py-1 text-xs ${isDark ? 'border-white/20' : 'border-[#cdb188]'}`}>{c.isVisible ? 'Hide' : 'Show'}</button>
                          <button type="button" onClick={() => onCategoryDelete(c._id)} className="rounded-lg border border-red-400/40 bg-red-500/10 px-2 py-1 text-xs text-red-300">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </form>

                <form onSubmit={onSaveHomepage} className={`rounded-2xl border p-5 ${isDark ? 'border-white/15 bg-black/20' : 'border-[#d4b288] bg-white/70'}`}>
                  <h3 className="font-display text-2xl">Homepage Content</h3>
                  <div className="mt-4 grid gap-3">
                    <input value={homepageForm.heroTitle || ''} onChange={(e) => setHomepageForm((p) => ({ ...p, heroTitle: e.target.value }))} placeholder="Hero title" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <textarea value={homepageForm.heroSubtitle || ''} onChange={(e) => setHomepageForm((p) => ({ ...p, heroSubtitle: e.target.value }))} placeholder="Hero subtitle" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={homepageForm.heroButtonText || ''} onChange={(e) => setHomepageForm((p) => ({ ...p, heroButtonText: e.target.value }))} placeholder="Hero button text" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={homepageForm.heroImageDark || ''} onChange={(e) => setHomepageForm((p) => ({ ...p, heroImageDark: e.target.value }))} placeholder="Hero image dark path" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={homepageForm.heroImageLight || ''} onChange={(e) => setHomepageForm((p) => ({ ...p, heroImageLight: e.target.value }))} placeholder="Hero image light path" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={homepageForm.premiumTitle || ''} onChange={(e) => setHomepageForm((p) => ({ ...p, premiumTitle: e.target.value }))} placeholder="Premium title" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <textarea value={homepageForm.premiumSubtitle || ''} onChange={(e) => setHomepageForm((p) => ({ ...p, premiumSubtitle: e.target.value }))} placeholder="Premium subtitle" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={homepageForm.bannerText || ''} onChange={(e) => setHomepageForm((p) => ({ ...p, bannerText: e.target.value }))} placeholder="Banner text" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={homepageForm.featuredSectionTitle || ''} onChange={(e) => setHomepageForm((p) => ({ ...p, featuredSectionTitle: e.target.value }))} placeholder="Featured section title" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={homepageForm.newArrivalsSectionTitle || ''} onChange={(e) => setHomepageForm((p) => ({ ...p, newArrivalsSectionTitle: e.target.value }))} placeholder="New arrivals section title" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                  </div>
                  <button type="submit" className="mt-4 rounded-xl border border-gold bg-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-noir">Save Homepage</button>
                </form>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <form onSubmit={onSaveSettings} className={`rounded-2xl border p-5 ${isDark ? 'border-white/15 bg-black/20' : 'border-[#d4b288] bg-white/70'}`}>
                  <h3 className="font-display text-2xl">Contact & Footer</h3>
                  <div className="mt-4 grid gap-3">
                    <input value={settingsForm.businessEmail || ''} onChange={(e) => setSettingsForm((p) => ({ ...p, businessEmail: e.target.value }))} placeholder="Business email" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={settingsForm.phone || ''} onChange={(e) => setSettingsForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={settingsForm.address || ''} onChange={(e) => setSettingsForm((p) => ({ ...p, address: e.target.value }))} placeholder="Address" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={settingsForm.instagram || ''} onChange={(e) => setSettingsForm((p) => ({ ...p, instagram: e.target.value }))} placeholder="Instagram link" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={settingsForm.facebook || ''} onChange={(e) => setSettingsForm((p) => ({ ...p, facebook: e.target.value }))} placeholder="Facebook link" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={settingsForm.whatsapp || ''} onChange={(e) => setSettingsForm((p) => ({ ...p, whatsapp: e.target.value }))} placeholder="WhatsApp link" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={settingsForm.youtube || ''} onChange={(e) => setSettingsForm((p) => ({ ...p, youtube: e.target.value }))} placeholder="YouTube link" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <textarea value={settingsForm.footerDescription || ''} onChange={(e) => setSettingsForm((p) => ({ ...p, footerDescription: e.target.value }))} placeholder="Footer description" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={settingsForm.quickLinksText || ''} onChange={(e) => setSettingsForm((p) => ({ ...p, quickLinksText: e.target.value }))} placeholder="Quick links text (comma separated)" className={`rounded-xl border px-3 py-2.5 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                  </div>
                  <button type="submit" className="mt-4 rounded-xl border border-gold bg-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-noir">Save Settings</button>
                </form>

                <div className={`rounded-2xl border p-5 ${isDark ? 'border-white/15 bg-black/20' : 'border-[#d4b288] bg-white/70'}`}>
                  <h3 className="font-display text-2xl">Testimonials & Why Choose Us</h3>
                  <form onSubmit={onAddTestimonial} className="mt-4 space-y-2">
                    <input value={testimonialForm.customerName} onChange={(e) => setTestimonialForm((p) => ({ ...p, customerName: e.target.value }))} placeholder="Customer name" className={`w-full rounded-xl border px-3 py-2 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <textarea value={testimonialForm.reviewText} onChange={(e) => setTestimonialForm((p) => ({ ...p, reviewText: e.target.value }))} placeholder="Review text" className={`w-full rounded-xl border px-3 py-2 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <input value={testimonialForm.role} onChange={(e) => setTestimonialForm((p) => ({ ...p, role: e.target.value }))} placeholder="Role/Location" className={`rounded-xl border px-3 py-2 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                      <input type="number" min="1" max="5" value={testimonialForm.rating} onChange={(e) => setTestimonialForm((p) => ({ ...p, rating: e.target.value }))} placeholder="Rating" className={`rounded-xl border px-3 py-2 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    </div>
                    <button type="submit" className="rounded-xl border border-gold bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wider text-noir">Add Testimonial</button>
                  </form>
                  <div className="mt-3 max-h-28 space-y-2 overflow-auto">
                    {testimonialsData.map((t) => <div key={t._id} className="flex items-center justify-between text-xs"><span>{t.customerName || t.name}</span><div className="flex gap-2"><button onClick={() => onTestimonialUpdate(t._id, { isVisible: !t.isVisible })} type="button" className={`rounded border px-2 py-1 ${isDark ? 'border-white/20' : 'border-[#cdb188]'}`}>{t.isVisible ? 'Hide' : 'Show'}</button><button onClick={() => onTestimonialDelete(t._id)} type="button" className="rounded border border-red-400/40 px-2 py-1 text-red-300">Del</button></div></div>)}
                  </div>
                  <form onSubmit={onAddWhy} className="mt-4 space-y-2">
                    <input value={whyForm.title} onChange={(e) => setWhyForm((p) => ({ ...p, title: e.target.value }))} placeholder="Why card title" className={`w-full rounded-xl border px-3 py-2 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <input value={whyForm.icon} onChange={(e) => setWhyForm((p) => ({ ...p, icon: e.target.value }))} placeholder="Icon name" className={`w-full rounded-xl border px-3 py-2 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <textarea value={whyForm.description} onChange={(e) => setWhyForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description" className={`w-full rounded-xl border px-3 py-2 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white'}`} />
                    <button type="submit" className="rounded-xl border border-gold bg-gold px-4 py-2 text-xs font-semibold uppercase tracking-wider text-noir">Add Why Card</button>
                  </form>
                  <div className="mt-3 max-h-28 space-y-2 overflow-auto">
                    {whyChooseUsData.map((w) => <div key={w._id} className="flex items-center justify-between text-xs"><span>{w.title}</span><div className="flex gap-2"><button onClick={() => onWhyUpdate(w._id, { isVisible: !w.isVisible })} type="button" className={`rounded border px-2 py-1 ${isDark ? 'border-white/20' : 'border-[#cdb188]'}`}>{w.isVisible ? 'Hide' : 'Show'}</button><button onClick={() => onWhyDelete(w._id)} type="button" className="rounded border border-red-400/40 px-2 py-1 text-red-300">Del</button></div></div>)}
                  </div>
                </div>
              </div>
              {adminMsg && <p className={`mt-4 text-sm ${isDark ? 'text-champagne' : 'text-[#7d582c]'}`}>{adminMsg}</p>}
            </div>
          </section>
        )}
        <section id="home" className="zoom-section relative min-h-screen overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,18,13,0.72)_0%,rgba(24,18,13,0.5)_38%,rgba(24,18,13,0.18)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,224,176,0.12),transparent_28%),linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.38))]" />
          <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] items-center px-5 py-20 md:px-8">
            <div className="max-w-3xl animate-fadeUp">
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#f2d7a3]/90">Fine Luxury Jewellery</p>
              <h1 className="max-w-2xl font-display text-5xl leading-tight text-[#fff8ef] md:text-7xl">
                {(content?.heroTitle || 'Timeless Jewellery')} <span className="gold-text">Crafted for Elegance</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#f2e7d8] md:text-lg">
                {content?.heroSubtitle || 'Discover handcrafted heirloom pieces in ethically sourced gold and diamonds, designed to celebrate every precious chapter of your story.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#products" className="luxe-button rounded-full border border-gold bg-gold px-7 py-3 text-sm font-semibold uppercase tracking-widest text-noir shadow-gold transition hover:-translate-y-0.5 hover:bg-champagne">
                  {content?.heroButtonText || 'Shop Collection'}
                </a>
                <a href="#collections" className="rounded-full border border-[#d9b67d] px-7 py-3 text-sm font-semibold uppercase tracking-widest text-[#f8ebd7] transition hover:bg-[#d9b67d] hover:text-[#2b1e14]">
                  Explore Designs
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="collections" className="zoom-section mx-auto w-full max-w-[1500px] px-5 py-16 md:px-8">
          <h2 className="section-title">{content?.featuredSectionTitle || 'Featured Categories'}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(categoriesData.length ? categoriesData : featuredCategories.map((c) => ({ name: c.name, icon: 'Gem' }))).filter((c) => c.isVisible !== false).map((item) => {
              const Icon = featuredCategories.find((x) => x.name === item.name)?.icon || Gem
              return (
              <button key={item.name} onClick={() => setActiveCategory(item.name)} className={`luxe-card group rounded-2xl p-5 text-left transition hover:-translate-y-1 hover:border-gold/60 ${isDark ? 'glass-panel shadow-glass' : 'border border-[#dfc8aa] bg-white/70 shadow-[0_12px_28px_rgba(86,61,35,0.12)]'}`}>
                <Icon className="mb-4 text-gold transition group-hover:scale-110" />
                <h3 className={`font-display text-2xl ${isDark ? 'text-ivory' : 'text-[#2f2319]'}`}>{item.name}</h3>
              </button>
            )})}
          </div>
        </section>

        <section id="products" className="zoom-section mx-auto w-full max-w-[1500px] px-5 py-12 md:px-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="section-title">{content?.newArrivalsSectionTitle || 'Curated New Arrivals'}</h2>
            <div className={`flex w-full max-w-md items-center rounded-full border px-4 py-2 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#d8c0a0] bg-white/85'}`}>
              <Search size={17} className="text-champagne" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products"
                className={`w-full bg-transparent px-3 py-1 text-sm outline-none ${isDark ? 'placeholder:text-ivory/45' : 'placeholder:text-[#7c6650]'}`}
              />
            </div>
          </div>

          <div className="mb-7 flex flex-wrap gap-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition ${
                  activeCategory === cat
                    ? 'border-gold bg-gold/20 text-champagne'
                    : isDark
                      ? 'border-white/15 text-ivory/70 hover:border-champagne'
                      : 'border-[#d8c0a0] text-[#604427] hover:border-[#ab844e]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((p) => {
              const productId = p._id || p.id
              return (
              <article key={productId} className={`luxe-card group overflow-hidden rounded-3xl border shadow-glass ${isDark ? 'border-white/10 bg-ebony/80' : 'border-[#e1ccb0] bg-white/85 shadow-[0_16px_30px_rgba(100,74,42,0.14)]'}`}>
                <div className="relative h-56 overflow-hidden sm:h-64">
                  <img src={normalizeImagePath(p.image)} alt={p.name} onError={(e) => { e.currentTarget.src = fallbackProductImage }} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <button onClick={() => toggleWishlist(productId)} className={`absolute right-4 top-4 rounded-full border p-2 ${isDark ? 'border-white/20 bg-noir/70' : 'border-[#d8c0a0] bg-white/80'}`}>
                    <Heart size={17} className={wishlist[productId] ? 'fill-gold text-gold' : isDark ? 'text-ivory' : 'text-[#694b2b]'} />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-2xl leading-tight">{p.name}</h3>
                  <p className={`mt-2 text-sm ${isDark ? 'text-ivory/60' : 'text-[#6c5542]'}`}>{p.categoryName || p.category}</p>
                  <div className="mt-3 flex items-center gap-1 text-gold">
                    {Array.from({ length: p.rating }).map((_, i) => (
                      <Star key={i} size={15} className="fill-gold" />
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-display text-3xl gold-text">${p.price}</p>
                  </div>
                </div>
              </article>
            )})}
          </div>
        </section>

        <section className="zoom-section mx-auto w-full max-w-[1500px] px-5 py-12 md:px-8">
          <div className={`luxe-card rounded-3xl border p-8 shadow-gold md:p-12 ${isDark ? 'border-gold/30 bg-banner' : 'border-[#d8bd98] bg-[linear-gradient(120deg,#fff5e7,#efd8b7)]'}`}>
            <p className="text-sm uppercase tracking-[0.35em] text-champagne/80">{content?.bannerText || 'Premium Collection'}</p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">{content?.premiumTitle || 'The Imperial Heirloom Edit'}</h2>
            <p className={`mt-4 max-w-2xl ${isDark ? 'text-ivory/75' : 'text-[#4b3a2e]'}`}>{content?.premiumSubtitle || 'Limited-edition masterpieces with rare cuts, bespoke settings, and ceremonial elegance for extraordinary moments.'}</p>
            <a href="#products" className="luxe-button mt-8 inline-flex rounded-full border border-champagne px-6 py-3 text-sm uppercase tracking-widest text-champagne transition hover:bg-champagne hover:text-noir">Discover Now</a>
          </div>
        </section>

        <section id="about" className="zoom-section mx-auto w-full max-w-[1500px] px-5 py-16 md:px-8">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {(whyChooseUsData.length ? whyChooseUsData : whyChooseUs).filter((item) => item.isVisible !== false).map((item) => {
              const Icon = item.icon && { ShieldCheck, Gem, Sparkles, ShoppingBag }[item.icon] ? { ShieldCheck, Gem, Sparkles, ShoppingBag }[item.icon] : Gem
              const detail = item.detail || item.description
              return (
              <article key={item._id || item.title} className={`rounded-2xl p-6 ${isDark ? 'glass-panel shadow-glass' : 'border border-[#dfc8aa] bg-white/75 shadow-[0_12px_28px_rgba(86,61,35,0.12)]'}`}>
                <Icon className="mb-4 text-gold" />
                <h3 className="font-display text-2xl">{item.title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-ivory/70' : 'text-[#5c4937]'}`}>{detail}</p>
              </article>
            )})}
          </div>
        </section>

        <section className="zoom-section mx-auto w-full max-w-[1500px] px-5 py-12 md:px-8">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {(testimonialsData.length ? testimonialsData : testimonials).filter((item) => item.isVisible !== false).map((item) => (
              <article key={item._id || item.name} className={`rounded-2xl border p-6 ${isDark ? 'border-white/10 bg-ebony shadow-glass' : 'border-[#dfc8aa] bg-white/80 shadow-[0_12px_28px_rgba(86,61,35,0.12)]'}`}>
                <div className="mb-4 flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-gold" />
                  ))}
                </div>
                <p className={`leading-relaxed ${isDark ? 'text-ivory/80' : 'text-[#4b3a2e]'}`}>"{item.text}"</p>
                <p className="mt-4 font-display text-2xl text-champagne">{item.name || item.customerName}</p>
                <p className={`text-sm ${isDark ? 'text-ivory/60' : 'text-[#6c5542]'}`}>{item.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="zoom-section mx-auto w-full max-w-5xl px-5 py-14 md:px-8">
          <div className={`rounded-3xl border p-8 text-center shadow-glass md:p-12 ${isDark ? 'border-white/15 bg-ebony' : 'border-[#dfc8aa] bg-white/85 shadow-[0_12px_28px_rgba(86,61,35,0.12)]'}`}>
            <Mail className="mx-auto text-gold" size={32} />
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Join The Kriscel Circle</h2>
            <p className={`mx-auto mt-4 max-w-2xl ${isDark ? 'text-ivory/75' : 'text-[#4b3a2e]'}`}>Receive first access to signature launches, private previews, and member-only offers.</p>
            <form onSubmit={(e) => {
              e.preventDefault()
              const message = `${email.trim()} requested to join newsletter`
              api.inquiries.create({ name: 'Newsletter User', email: email.trim(), message }).catch(() => {})
              onNewsletterSubmit(e)
            }} className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full rounded-full border px-5 py-3 outline-none ${isDark ? 'border-white/20 bg-noir placeholder:text-ivory/45 focus:border-champagne' : 'border-[#d8c0a0] bg-[#fffaf2] placeholder:text-[#7c6650] focus:border-[#ab844e]'}`}
              />
              <button type="submit" className="luxe-button rounded-full border border-gold bg-gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-noir transition hover:bg-champagne">
                Subscribe
              </button>
            </form>
            {success && <p className="mt-4 text-sm text-champagne">{success}</p>}
          </div>
        </section>
      </main>

      <footer className={`zoom-section border-t ${isDark ? 'border-white/10 bg-black/60' : 'border-[#d8c0a0] bg-[#f3e5d1]/75'}`}>
        <div className="mx-auto grid w-full max-w-[1500px] gap-8 px-5 py-10 md:grid-cols-4 md:px-8">
          <div>
            <p className="font-display text-3xl gold-text">{brandName}</p>
            <p className={`mt-3 text-sm ${isDark ? 'text-ivory/65' : 'text-[#5c4937]'}`}>{contactSettings?.footerDescription || 'Fine jewellery crafted with timeless artistry and modern luxury.'}</p>
          </div>
          <div>
            <h4 className="font-semibold text-champagne">Quick Links</h4>
            <div className={`mt-3 flex flex-col gap-2 text-sm ${isDark ? 'text-ivory/70' : 'text-[#604427]'}`}>
              {(contactSettings?.quickLinksText?.length ? contactSettings.quickLinksText : navLinks.map((l) => l.label)).map((label) => <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, '')}`}>{label}</a>)}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-champagne">Contact</h4>
            <p className={`mt-3 text-sm ${isDark ? 'text-ivory/70' : 'text-[#604427]'}`}>{contactSettings?.businessEmail || 'Info@kriscel.com'}</p>
            <p className={`text-sm ${isDark ? 'text-ivory/70' : 'text-[#604427]'}`}>{contactSettings?.phone || '+1 (212) 555-0188'}</p>
            <p className={`text-sm ${isDark ? 'text-ivory/70' : 'text-[#604427]'}`}>{contactSettings?.address || 'Fifth Avenue, New York'}</p>
          </div>
          <div>
            <h4 className="font-semibold text-champagne">Social</h4>
            <div className="mt-3 flex gap-2">
              {['IG', 'FB', 'PI', 'YT'].map((s) => (
                <span key={s} className={`rounded-full border px-3 py-1 text-xs ${isDark ? 'border-white/20 text-ivory/80' : 'border-[#cdb188] text-[#6b4c25]'}`}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
