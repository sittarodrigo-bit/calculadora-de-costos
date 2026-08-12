import React, { useState } from 'react';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-amber-900 mb-2">Calculadora de Costos</h1>
          <p className="text-lg text-amber-700 font-light">Portal del Viento - Gestión inteligente de producción</p>
        </div>

        {/* Top Stats - Products Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-5 border-t-4 border-amber-400 hover:shadow-lg transition">
              <h3 className="font-bold text-amber-900 mb-3 text-sm uppercase tracking-wide">{product.name}</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Costo</p>
                  <p className="text-2xl font-black text-amber-700">${calculateCost(product.id).toFixed(2)}</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600">Precio</p>
                  <p className="text-xl font-bold text-green-600">${calculatePrice(product.id).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Configuration Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10 border-l-4 border-blue-400">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">⚙️ Configuración General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold text-gray-700">MARGEN DE GANANCIA</label>
                <span className="text-3xl font-black text-green-600">{margin}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={margin}
                onChange={(e) => setMargin(parseInt(e.target.value))}
                className="w-full h-3 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="font-bold text-blue-900 text-sm mb-2">💡 MÉTODOS DE MANO DE OBRA</p>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>✓ Costo total por lote</li>
                <li>✓ Costo por unidad</li>
                <li>✓ Costo horario</li>
                <li>✓ Por empleado (múltiples)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ingredients Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-10 border-l-4 border-purple-400">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-900">📦 Ingredientes</h2>
            <button
              onClick={addIngredient}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-bold shadow-md transition"
            >
              <Plus size={18} /> Agregar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-purple-100 to-purple-50 border-b-2 border-purple-300">
                  <th className="text-left py-3 px-4 font-bold text-purple-900">Ingrediente</th>
                  <th className="text-left py-3 px-4 font-bold text-purple-900">Costo/Unidad</th>
                  <th className="text-left py-3 px-4 font-bold text-purple-900">Unidad</th>
                  <th className="text-center py-3 px-4 font-bold text-purple-900">Acción</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ing, idx) => (
                  <tr key={ing.id} className={`border-b ${idx % 2 === 0 ? 'bg-purple-50' : 'bg-white'} hover:bg-purple-100 transition`}>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-purple-500"
                        placeholder="Nombre"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={ing.costPerUnit}
                        onChange={(e) => updateIngredient(ing.id, 'costPerUnit', e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-purple-500"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ing.unit}
                        onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-purple-500"
                      >
                        <option>kg</option>
                        <option>g</option>
                        <option>l</option>
                        <option>ml</option>
                        <option>un</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteIngredient(ing.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Detail */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-rose-400">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-rose-900">🎯 Detalle de Productos</h2>
            <button
              onClick={addProduct}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold shadow-md transition"
            >
              <Plus size={18} /> Agregar
            </button>
          </div>

          <div className="space-y-6">
            {products.map((product) => (
              <div key={product.id} className="bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-6">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                    className="text-2xl font-bold text-rose-900 bg-transparent border-b-2 border-rose-400 flex-1 px-2 py-1 focus:outline-none focus:border-rose-600"
                    placeholder="Nombre"
                  />
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition ml-4"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 block">
                    Unidades por lote
                  </label>
                  <input
                    type="number"
                    value={product.unitsPerBatch}
                    onChange={(e) => updateProduct(product.id, 'unitsPerBatch', e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded text-gray-800 w-32 focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Cost Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6 bg-white rounded-lg p-4 border-2 border-gray-200">
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">Costo Unitario</p>
                    <p className="text-3xl font-black text-amber-700">
                      ${calculateCost(product.id).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center border-l-2 border-r-2 border-gray-300">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">Margen</p>
                    <p className="text-3xl font-black text-green-600">{margin}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-600 uppercase mb-1">Precio Venta</p>
                    <p className="text-3xl font-black text-rose-600">
                      ${calculatePrice(product.id).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Labor Configuration Button */}
                <button
                  onClick={() => setExpandedProductLabor(expandedProductLabor === product.id ? null : product.id)}
                  className="w-full flex items-center justify-between bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold px-6 py-3 rounded-lg shadow-md transition mb-4"
                >
                  <span>⚙️ Configurar Mano de Obra</span>
                  {expandedProductLabor === product.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedProductLabor === product.id && (
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mb-4">
                    <h4 className="font-bold text-yellow-900 mb-4 text-lg">Método de Cálculo</h4>
                    
                    <select
                      value={product.laborMethod}
                      onChange={(e) => updateProductLabor(product.id, 'laborMethod', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-yellow-400 rounded text-gray-800 font-semibold mb-4 focus:outline-none focus:border-yellow-600"
                    >
                      <option value="totalPerBatch">💰 Costo TOTAL por lote</option>
                      <option value="perUnit">🔢 Costo por UNIDAD</option>
                      <option value="hourly">⏱️ Costo HORARIO</option>
                      <option value="employees">👥 Por EMPLEADO</option>
                    </select>

                    {product.laborMethod === 'totalPerBatch' && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Costo total lote ({product.unitsPerBatch} unidades)</label>
                        <input
                          type="number"
                          value={product.laborData.totalPerBatch}
                          onChange={(e) => updateLaborData(product.id, 'totalPerBatch', e.target.value)}
                          className="w-full px-4 py-2 border-2 border-yellow-300 rounded text-gray-800 focus:outline-none focus:border-yellow-600"
                          placeholder="0"
                          step="0.01"
                        />
                        <p className="text-xs text-yellow-700 mt-2 font-semibold">
                          → ${(product.laborData.totalPerBatch / product.unitsPerBatch).toFixed(2)} por unidad
                        </p>
                      </div>
                    )}

                    {product.laborMethod === 'perUnit' && (
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Costo por unidad</label>
                        <input
                          type="number"
                          value={product.laborData.perUnit}
                          onChange={(e) => updateLaborData(product.id, 'perUnit', e.target.value)}
                          className="w-full px-4 py-2 border-2 border-yellow-300 rounded text-gray-800 focus:outline-none focus:border-yellow-600"
                          placeholder="0"
                          step="0.01"
                        />
                        <p className="text-xs text-yellow-700 mt-2 font-semibold">
                          → ${(product.laborData.perUnit * product.unitsPerBatch).toFixed(2)} total lote
                        </p>
                      </div>
                    )}

                    {product.laborMethod === 'hourly' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Tarifa horaria ($)</label>
                          <input
                            type="number"
                            value={product.laborData.hourlyRate}
                            onChange={(e) => updateLaborData(product.id, 'hourlyRate', e.target.value)}
                            className="w-full px-4 py-2 border-2 border-yellow-300 rounded text-gray-800 focus:outline-none focus:border-yellow-600"
                            placeholder="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Horas estimadas</label>
                          <input
                            type="number"
                            value={product.laborData.estimatedHours}
                            onChange={(e) => updateLaborData(product.id, 'estimatedHours', e.target.value)}
                            className="w-full px-4 py-2 border-2 border-yellow-300 rounded text-gray-800 focus:outline-none focus:border-yellow-600"
                            placeholder="0"
                            step="0.1"
                          />
                        </div>
                        <p className="text-xs text-yellow-700 bg-white p-2 rounded font-semibold">
                          Total: ${(product.laborData.hourlyRate * product.laborData.estimatedHours).toFixed(2)}
                        </p>
                      </div>
                    )}

                    {product.laborMethod === 'employees' && (
                      <div className="space-y-3">
                        {product.laborData.employees.map((emp) => (
                          <div key={emp.id} className="bg-white p-3 rounded border-2 border-yellow-200">
                            <div className="grid grid-cols-4 gap-2 mb-2">
                              <input
                                type="text"
                                value={emp.name}
                                onChange={(e) => updateEmployee(product.id, emp.id, 'name', e.target.value)}
                                className="col-span-2 px-2 py-1 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:border-yellow-600"
                                placeholder="Nombre"
                              />
                              <input
                                type="number"
                                value={emp.hours}
                                onChange={(e) => updateEmployee(product.id, emp.id, 'hours', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:border-yellow-600"
                                placeholder="Horas"
                                step="0.1"
                              />
                              <input
                                type="number"
                                value={emp.hourlyRate}
                                onChange={(e) => updateEmployee(product.id, emp.id, 'hourlyRate', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:border-yellow-600"
                                placeholder="$/h"
                                step="0.01"
                              />
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-gray-800">
                                ${(emp.hours * emp.hourlyRate).toFixed(2)}
                              </span>
                              <button
                                onClick={() => deleteEmployee(product.id, emp.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addEmployee(product.id)}
                          className="w-full text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-bold transition"
                        >
                          + Agregar empleado
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Recipe Section */}
                <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-4">📝 Receta</h4>
                  <div className="space-y-2">
                    {product.recipeItems.length === 0 ? (
                      <p className="text-gray-500 text-sm italic">Sin ingredientes</p>
                    ) : (
                      product.recipeItems.map((item) => {
                        const ingredient = ingredients.find(i => i.id === item.ingredientId);
                        return (
                          <div key={item.ingredientId} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                            <select
                              value={item.ingredientId}
                              onChange={(e) =>
                                updateRecipeItem(product.id, item.ingredientId, item.quantity)
                              }
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-gray-600"
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
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-xs text-gray-800 focus:outline-none focus:border-gray-600"
                              placeholder="Cant"
                              step="0.01"
                            />
                            <span className="text-xs text-gray-600 w-10">{ingredient?.unit || 'un'}</span>
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
                              className="text-red-500 hover:text-red-700 p-1"
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
                    className="mt-3 w-full text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-bold transition"
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
