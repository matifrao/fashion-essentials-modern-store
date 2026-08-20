import { supabase } from "./supabase.js";

const tables = { products: "products", categories: "categories", brands: "brands", blogs: "blog_posts", orders: "orders", customers: "customers" };
const normalise = row => row?.data ? { ...row.data, id: row.id, createdAt: row.created_at, updatedAt: row.updated_at } : row;
const record = value => ({ data: value, name: value.name || value.title || "", slug: value.slug || "", sku: value.sku || "", status: value.status || "Draft", price: Number(value.price || 0), stock: Number(value.stock || 0), category: value.category || "", brand: value.brand || "", images: value.images || [] });
async function list(name) { return (await supabase.select(tables[name], "select=*&order=created_at.desc")).map(normalise); }
async function get(name, id) { const rows = await supabase.select(tables[name], `select=*&id=eq.${encodeURIComponent(id)}`); return rows[0] ? normalise(rows[0]) : null; }
const resource = name => ({ list: () => list(name), get: id => get(name, id), create: async value => normalise((await supabase.insert(tables[name], record(value)))[0]), update: async (id, value) => normalise((await supabase.update(tables[name], id, record(value)))[0]), patch: async (id, value) => normalise((await supabase.update(tables[name], id, record(value)))[0]), delete: id => supabase.remove(tables[name], id) });
export const productsApi = resource("products"); export const categoriesApi = resource("categories"); export const brandsApi = resource("brands"); export const blogsApi = resource("blogs"); export const ordersApi = resource("orders"); export const customersApi = resource("customers");
export const authApi = { login: ({ email, password }) => supabase.login(email, password), logout: () => supabase.logout(), me: () => supabase.user() };
export const dashboardApi = { async stats() { const products = await productsApi.list(); return { products: products.length, lowStock: products.filter(p => p.stock <= 5).length }; } };
const fromPath = path => { const [, table, id] = path.split("/"); const api = ({ products: productsApi, categories: categoriesApi, brands: brandsApi, blogs: blogsApi, orders: ordersApi, customers: customersApi })[table]; if (!api) throw new Error(`Unsupported data collection: ${table}`); return { api, id }; };
const api = { async get(path) { const { api, id } = fromPath(path); return id ? api.get(id) : api.list(); }, async post(path, value) { return fromPath(path).api.create(value); }, async put(path, value) { const { api, id } = fromPath(path); return api.update(id, value); }, async patch(path, value) { const { api, id } = fromPath(path); return api.patch(id, value); }, async delete(path) { const { api, id } = fromPath(path); return api.delete(id); } };
export { supabase }; export default api;
