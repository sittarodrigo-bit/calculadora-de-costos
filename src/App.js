import React, { useState } from 'react';
import { Trash2, Plus, ChevronDown, ChevronUp, Settings, TrendingUp, Zap } from 'lucide-react';

export default function CostCalculator() {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Chocolate', costPerUnit: 50, unit: 'kg' },
    { id: 2, name: 'Dulce de leche', costPerUnit: 80, unit: 'kg' },
    { id: 3, name: 'Maicena', costPerUnit: 15, unit: 'kg' },
    { id: 4, name: 'Azúcar', costPerUnit: 20, unit: 'kg' },
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Alfajor',
      recipeItems: [
        { ingredientId: 1, quantity: 0.05 },
        { ingredientId: 2, quantity: 0.08 },
        { ingredientId: 3, quantity: 0.02 },
      ],
      unitsPerBatch: 10,
      laborMethod: 'totalPerBatch',
      laborData: {
        totalPerBatch: 100,
        perUnit: 0,
        hourlyRate: 0,
        estimatedHours: 0,
        employees: [],
      },
    },
    {
      id: 2,
      name: 'Trufa',
      recipeItems: [
        { ingredientId: 1, quantity: 0.1 },
        { ingredientId: 2, quantity: 0.05 },
      ],
      unitsPerBatch: 20,
      laborMethod: 'totalPerBatch',
      laborData: {
        totalPerBatch: 80,
        perUnit: 0,
        hourlyRate: 0,
        estimatedHours: 0,
        employees: [],
      },
    },
    {
      id: 3,
      name: 'Conito',
      recipeItems: [
        { ingredientId: 1, quantity: 0.06 },
        { ingredientId: 4, quantity: 0.03 },
      ],
      unitsPerBatch: 15,
      laborMethod: 'totalPerBatch',
      laborData: {
        totalPerBatch: 75,
        perUnit: 0,
        hourlyRate: 0,
        estimatedHours: 0,
        employees: [],
      },
    },
    {
      id: 4,
      name: 'Cubanito',
      recipeItems: [
        { ingredientId: 2, quantity: 0.1 },
        { ingredientId: 1, quantity: 0.04 },
      ],
      unitsPerBatch: 12,
      laborMethod: 'totalPerBatch',
      laborData: {
        totalPerBatch: 85,
        perUnit: 0,
        hourlyRate: 0,
        estimatedHours: 0,
        employees: [],
      },
    },
  ]);

  const [margin, setMargin] = useState(30);
  const [expandedProductLabor, setExpandedProductLabor] = useState(null);

  const calculateLaborCost = (product) => {
    const { laborMethod, laborData, unitsPerBatch } = product;
    
    switch (laborMethod) {
      case 'totalPerBatch':
        return laborData.totalPerBatch || 0;
      case 'perUnit':
        return (laborData.perUnit || 0) * unitsPerBatch;
      case 'hourly':
        return (laborData.hourlyRate || 0) * (laborData.estimatedHours || 0);
      case 'employees':
        return laborData.employees.reduce((sum, emp) => sum + ((emp.hours || 0) * (emp.hourlyRate || 0)), 0);
      default:
        return 0;
    }
  };

  const addIngredient = () => {
    const newId = Math.max(...ingredients.map(i => i.id), 0) + 1;
    setIngredients([...ingredients, { id: newId, name: '', costPerUnit: 0, unit: 'kg' }]);
  };

  const updateIngredient = (id, field, value) => {
    setIngredients(ingredients.map(i =>
      i.id === id ? { ...i, [field]: field === 'costPerUnit' ? parseFloat(value) || 0 : value } : i
    ));
  };

  const deleteIngredient = (id) => {
    setIngredients(ingredients.filter(i => i.id !== id));
    setProducts(products.map(p => ({
      ...p,
      recipeItems: p.recipeItems.filter(r => r.ingredientId !== id),
    })));
  };

  const updateRecipeItem = (productId, ingredientId, quantity) => {
    setProducts(products.map(p =>
      p.id === productId
        ? {
            ...p,
            recipeItems: p.recipeItems.map(r =>
              r.ingredientId === ingredientId ? { ...r, quantity: parseFloat(quantity) || 0 } : r
            ),
          }
        : p
    ));
  };

  const updateProduct = (id, field, value) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, [field]: field === 'unitsPerBatch' ? parseInt(value) || 0 : value } : p
    ));
  };

  const updateProductLabor = (productId, field, value) => {
    setProducts(products.map(p =>
      p.id === productId
        ? { ...p, [field]: value }
        : p
    ));
  };

  const updateLaborData = (productId, field, value) => {
    setProducts(products.map(p =>
      p.id === productId
        ? { ...p, laborData: { ...p.laborData, [field]: field === 'totalPerBatch' || field === 'perUnit' || field === 'hourlyRate' || field === 'estimatedHours' ? parseFloat(value) || 0 : value } }
        : p
    ));
  };

  const addEmployee = (productId) => {
    setProducts(products.map(p =>
      p.id === productId
        ? {
            ...p,
            laborData: {
              ...p.laborData,
              employees: [...p.laborData.employees, { id: Date.now(), name: '', hours: 0, hourlyRate: 0 }],
            },
          }
        : p
    ));
  };

  const updateEmployee = (productId, empId, field, value) => {
    setProducts(products.map(p =>
      p.id === productId
        ? {
            ...p,
            laborData: {
              ...p.laborData,
              employees: p.laborData.employees.map(e =>
                e.id === empId ? { ...e, [field]: field === 'hours' || field === 'hourlyRate' ? parseFloat(value) || 0 : value } : e
              ),
            },
          }
        : p
    ));
  };

  const deleteEmployee = (productId, empId) => {
    setProducts(products.map(p =>
      p.id === productId
        ? {
            ...p,
            laborData: {
              ...p.laborData,
              employees: p.laborData.employees.filter(e => e.id !== empId),
            },
          }
        : p
    ));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addProduct = () => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts([...products, { id: newId, name: '', recipeItems: [], unitsPerBatch: 1, laborMethod: 'totalPerBatch', laborData: { totalPerBatch: 0, perUnit: 0, hourlyRate: 0, estimatedHours: 0, employees: [] } }]);
  };

  const calculateCost = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;

    const rawCost = product.recipeItems.reduce((total, item) => {
      const ingredient = ingredients.find(i => i.id === item.ingredientId);
      return total + (ingredient ? ingredient.costPerUnit * item.quantity : 0);
    }, 0);

    const laborCost = calculateLaborCost(product);
    const totalCost = rawCost + laborCost;
    return totalCost / product.unitsPerBatch;
  };

  const calculatePrice = (productId) => {
    const cost = calculateCost(productId);
    return cost * (1 + margin / 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-rose-400" size={32} />
            <h1 className="text-5xl font-black text-white">Portal del Viento</h1>
          </div>
          <p className="text-rose-300 text-lg font-light">Calculadora inteligente de costos de producción</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Productos Preview */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-rose-500/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="text-rose-400" size={28} />
                Resumen de Productos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-gradient-to-br from-rose-500 to-orange-600 rounded-xl p-5 shadow-lg transform hover:scale-105 transition duration-300">
                    <h3 className="font-bold text-white text-lg mb-3">{product.name}</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-rose-100 text-sm">Costo unitario</p>
                        <p className="text-2xl font-black text-white">${calculateCost(product.id).toFixed(2)}</p>
                      </div>
                      <div className="pt-2 border-t border-white/20">
                        <p className="text-rose-100 text-sm">Precio venta</p>
                        <p className="text-xl font-bold text-yellow-200">${calculatePrice(product.id).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-blue-500/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="text-blue-400" size={24} />
              Configuración
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-white">Margen de ganancia</label>
                  <span className="text-2xl font-black text-green-400">{margin}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-400"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm font-semibold mb-2">📋 Mano de obra</p>
                <p className="text-blue-200 text-xs leading-relaxed">Configura por producto. 4 métodos: total, unitario, horario o por empleado.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-purple-500/20 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">📦 Ingredientes</h2>
            <button
              onClick={addIngredient}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-5 py-3 rounded-lg font-bold shadow-lg transform hover:scale-105 transition"
            >
              <Plus size={20} /> Agregar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-purple-500/50">
                  <th className="text-left py-4 px-4 font-bold text-purple-300">Ingrediente</th>
                  <th className="text-left py-4 px-4 font-bold text-purple-300">Costo/unidad</th>
                  <th className="text-left py-4 px-4 font-bold text-purple-300">Unidad</th>
                  <th className="py-4 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ing) => (
                  <tr key={ing.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                    <td className="py-4 px-4">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                        placeholder="Nombre"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <input
                        type="number"
                        value={ing.costPerUnit}
                        onChange={(e) => updateIngredient(ing.id, 'costPerUnit', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
                        placeholder="Costo"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={ing.unit}
                        onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      >
                        <option>kg</option>
                        <option>g</option>
                        <option>l</option>
                        <option>ml</option>
                        <option>un</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => deleteIngredient(ing.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Detail */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-amber-500/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">🎯 Detalles de Productos</h2>
            <button
              onClick={addProduct}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white px-5 py-3 rounded-lg font-bold shadow-lg transform hover:scale-105 transition"
            >
              <Plus size={20} /> Agregar
            </button>
          </div>

          <div className="space-y-6">
            {products.map((product) => (
              <div key={product.id} className="bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-amber-500/50 rounded-xl p-6 shadow-lg hover:border-amber-400/80 transition">
                <div className="flex justify-between items-start mb-6">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                    className="text-2xl font-bold text-white bg-transparent border-b-2 border-amber-400 px-2 py-1 flex-1 focus:outline-none focus:border-amber-300"
                    placeholder="Nombre del producto"
                  />
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition ml-4"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Unidades por lote:
                  </label>
                  <input
                    type="number"
                    value={product.unitsPerBatch}
                    onChange={(e) => updateProduct(product.id, 'unitsPerBatch', e.target.value)}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white w-32 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6 bg-slate-600/50 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-slate-300 text-sm font-semibold">Costo unitario</p>
                    <p className="text-3xl font-black text-amber-400">
                      ${calculateCost(product.id).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center border-x border-slate-500">
                    <p className="text-slate-300 text-sm font-semibold">Margen</p>
                    <p className="text-3xl font-black text-green-400">{margin}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-300 text-sm font-semibold">Precio venta</p>
                    <p className="text-3xl font-black text-rose-300">
                      ${calculatePrice(product.id).toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedProductLabor(expandedProductLabor === product.id ? null : product.id)}
                  className="w-full flex items-center justify-between bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-4 py-3 rounded-lg shadow-lg transition mb-4"
                >
                  <span>⚙️ Configurar mano de obra</span>
                  {expandedProductLabor === product.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedProductLabor === product.id && (
                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-lg p-6 mb-4">
                    <h4 className="font-bold text-white mb-4 text-lg">Método de cálculo</h4>
                    
                    <select
                      value={product.laborMethod}
                      onChange={(e) => updateProductLabor(product.id, 'laborMethod', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border-2 border-yellow-400 rounded-lg text-white font-semibold mb-4 focus:outline-none focus:border-yellow-300"
                    >
                      <option value="totalPerBatch">💰 Costo TOTAL por lote</option>
                      <option value="perUnit">🔢 Costo por UNIDAD</option>
                      <option value="hourly">⏱️ Costo HORARIO (tarifa + horas)</option>
                      <option value="employees">👥 Por EMPLEADO (múltiples)</option>
                    </select>

                    {product.laborMethod === 'totalPerBatch' && (
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Costo total para este lote de {product.unitsPerBatch} unidades:
                        </label>
                        <input
                          type="number"
                          value={product.laborData.totalPerBatch}
                          onChange={(e) => updateLaborData(product.id, 'totalPerBatch', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                          placeholder="Ej: 100"
                          step="0.01"
                        />
                        <p className="text-xs text-yellow-300 mt-2">
                          = ${(product.laborData.totalPerBatch / product.unitsPerBatch).toFixed(2)} por unidad
                        </p>
                      </div>
                    )}

                    {product.laborMethod === 'perUnit' && (
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Costo por unidad:
                        </label>
                        <input
                          type="number"
                          value={product.laborData.perUnit}
                          onChange={(e) => updateLaborData(product.id, 'perUnit', e.target.value)}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                          placeholder="Ej: 5"
                          step="0.01"
                        />
                        <p className="text-xs text-yellow-300 mt-2">
                          = ${(product.laborData.perUnit * product.unitsPerBatch).toFixed(2)} para el lote
                        </p>
                      </div>
                    )}

                    {product.laborMethod === 'hourly' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">
                            Tarifa horaria ($):
                          </label>
                          <input
                            type="number"
                            value={product.laborData.hourlyRate}
                            onChange={(e) => updateLaborData(product.id, 'hourlyRate', e.target.value)}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                            placeholder="Ej: 500"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-white mb-2">
                            Horas estimadas:
                          </label>
                          <input
                            type="number"
                            value={product.laborData.estimatedHours}
                            onChange={(e) => updateLaborData(product.id, 'estimatedHours', e.target.value)}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                            placeholder="Ej: 2.5"
                            step="0.1"
                          />
                        </div>
                        <p className="text-xs text-yellow-300 bg-slate-700 p-2 rounded">
                          Total: ${(product.laborData.hourlyRate * product.laborData.estimatedHours).toFixed(2)}
                        </p>
                      </div>
                    )}

                    {product.laborMethod === 'employees' && (
                      <div className="space-y-3">
                        {product.laborData.employees.map((emp) => (
                          <div key={emp.id} className="bg-slate-700 p-3 rounded-lg border border-slate-600">
                            <div className="grid grid-cols-4 gap-2 mb-2">
                              <input
                                type="text"
                                value={emp.name}
                                onChange={(e) => updateEmployee(product.id, emp.id, 'name', e.target.value)}
                                className="col-span-2 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-sm text-white focus:outline-none focus:border-yellow-400"
                                placeholder="Nombre"
                              />
                              <input
                                type="number"
                                value={emp.hours}
                                onChange={(e) => updateEmployee(product.id, emp.id, 'hours', e.target.value)}
                                className="px-2 py-1 bg-slate-600 border border-slate-500 rounded text-sm text-white focus:outline-none focus:border-yellow-400"
                                placeholder="Horas"
                                step="0.1"
                              />
                              <input
                                type="number"
                                value={emp.hourlyRate}
                                onChange={(e) => updateEmployee(product.id, emp.id, 'hourlyRate', e.target.value)}
                                className="px-2 py-1 bg-slate-600 border border-slate-500 rounded text-sm text-white focus:outline-none focus:border-yellow-400"
                                placeholder="$/h"
                                step="0.01"
                              />
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-yellow-300 font-semibold">
                                ${(emp.hours * emp.hourlyRate).toFixed(2)}
                              </span>
                              <button
                                onClick={() => deleteEmployee(product.id, emp.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addEmployee(product.id)}
                          className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                          + Agregar empleado
                        </button>
                        <p className="text-xs text-yellow-300 bg-slate-700 p-2 rounded font-semibold">
                          Total: ${product.laborData.employees.reduce((sum, e) => sum + (e.hours * e.hourlyRate), 0).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-gradient-to-br from-rose-500/20 to-orange-500/20 border-2 border-rose-400/50 rounded-lg p-5">
                  <h4 className="font-bold text-white mb-4">🧪 Receta</h4>
                  <div className="space-y-3">
                    {product.recipeItems.length === 0 ? (
                      <p className="text-slate-400 text-sm italic">Sin ingredientes agregados</p>
                    ) : (
                      product.recipeItems.map((item) => {
                        const ingredient = ingredients.find(i => i.id === item.ingredientId);
                        return (
                          <div key={item.ingredientId} className="flex items-center gap-2 bg-slate-700 p-2 rounded">
                            <select
                              value={item.ingredientId}
                              onChange={(e) =>
                                updateRecipeItem(
                                  product.id,
                                  item.ingredientId,
                                  item.quantity
                                )
                              }
                              className="flex-1 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-xs text-white focus:outline-none focus:border-rose-400"
                            >
                              {ingredients.map((ing) => (
                                <option key={ing.id} value={ing.id}>
                                  {ing.name}
                                </option>
                              ))}
                            </select>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateRecipeItem(product.id, item.ingredientId, e.target.value)
                              }
                              className="w-20 px-2 py-1 bg-slate-600 border border-slate-500 rounded text-xs text-white focus:outline-none focus:border-rose-400"
                              placeholder="Cant"
                              step="0.01"
                            />
                            <span className="text-xs text-slate-300 w-10">{ingredient?.unit || 'un'}</span>
                            <button
                              onClick={() =>
                                setProducts(
                                  products.map((p) =>
                                    p.id === product.id
                                      ? {
                                          ...p,
                                          recipeItems: p.recipeItems.filter(
                                            (r) => r.ingredientId !== item.ingredientId
                                          ),
                                        }
                                      : p
                                  )
                                )
                              }
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <button
                    onClick={() => {
                      const newIngredientId = ingredients[0]?.id || 1;
                      setProducts(
                        products.map((p) =>
                          p.id === product.id
                            ? {
                                ...p,
                                recipeItems: [...p.recipeItems, { ingredientId: newIngredientId, quantity: 0 }],
                              }
                            : p
                        )
                      );
                    }}
                    className="mt-3 w-full text-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    + Agregar ingrediente
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
