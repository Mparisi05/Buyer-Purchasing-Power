import React, { useState, useEffect } from 'react';
import { DollarSign, Building2, Home, TrendingUp, Info } from 'lucide-react';

export default function AffordabilityFromCashFlow() {
  // Property type states
  const [propertyType, setPropertyType] = useState('');
  const [officeSubtype, setOfficeSubtype] = useState('');
  
  // Primary input - Annual Free Cash Flow
  const [annualFreeCashFlow, setAnnualFreeCashFlow] = useState(150000);
  
  // Financial inputs
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [amortYears, setAmortYears] = useState(25);
  const [interestRate, setInterestRate] = useState(5.99);
  const [dcrRatio, setDcrRatio] = useState(1.25);
  const [squareFootage, setSquareFootage] = useState(4000);
  
  // Operating expense rates per SF
  const opexRates = {
    'standalone-office': 8.00,
    'standalone-medical': 8.00 * 1.30,
    'office-condo': 6.00,
    'medical-condo': 6.00 * 1.30,
    'industrial': 4.00,
    'flex': 5.50
  };
  
  // Get current operating expense rate
  const getOpexRate = () => {
    if (propertyType === 'Office') {
      return opexRates[officeSubtype] || 0;
    } else if (propertyType === 'Industrial') {
      return opexRates['industrial'];
    } else if (propertyType === 'Flex') {
      return opexRates['flex'];
    }
    return 0;
  };
  
  // Monthly free cash flow
  const monthlyFreeCashFlow = annualFreeCashFlow / 12;
  
  // Maximum annual expenses based on DCR (FCF / DCR = Max Annual Expenses)
  const maxAnnualExpenses = annualFreeCashFlow / dcrRatio;
  const maxMonthlyExpenses = maxAnnualExpenses / 12;
  
  // Calculate monthly operating expenses
  const annualOpex = squareFootage * getOpexRate();
  const monthlyOpex = annualOpex / 12;
  
  // Available for mortgage payment
  const availableForMortgage = maxMonthlyExpenses - monthlyOpex;
  
  // Calculate maximum loan amount from monthly payment
  const calculateMaxLoan = (monthlyPayment, rate, years) => {
    if (monthlyPayment <= 0) return 0;
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    if (monthlyRate === 0) return monthlyPayment * numPayments;
    return monthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1) / 
           (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
  };
  
  const maxLoanAmount = calculateMaxLoan(availableForMortgage, interestRate, amortYears);
  
  // Calculate purchase price
  const maxPurchasePrice = maxLoanAmount / (1 - downPaymentPercent / 100);
  const requiredDownPayment = maxPurchasePrice * (downPaymentPercent / 100);
  
  // Calculate actual monthly mortgage payment for display
  const calculateMonthlyPayment = (principal, rate, years) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    if (monthlyRate === 0) return principal / numPayments;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };
  
  const monthlyMortgage = calculateMonthlyPayment(maxLoanAmount, interestRate, amortYears);
  
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };
  
  const formatCurrencyDecimal = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Purchasing Power</h1>
          </div>
          <p className="text-emerald-100 text-sm">See what you can afford</p>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Annual Free Cash Flow - Primary Input */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              Annual Free Cash Flow: {formatCurrency(annualFreeCashFlow)}
            </label>
            
            {/* Arrow buttons and slider */}
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setAnnualFreeCashFlow(Math.max(50000, annualFreeCashFlow - 10000))}
                className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                disabled={annualFreeCashFlow <= 50000}
              >
                <span className="text-2xl font-bold">←</span>
              </button>
              
              <input
                type="range"
                min="50000"
                max="500000"
                step="10000"
                value={annualFreeCashFlow}
                onChange={(e) => setAnnualFreeCashFlow(Number(e.target.value))}
                className="flex-1 h-3 bg-blue-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              
              <button
                onClick={() => setAnnualFreeCashFlow(Math.min(500000, annualFreeCashFlow + 10000))}
                className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
                disabled={annualFreeCashFlow >= 500000}
              >
                <span className="text-2xl font-bold">→</span>
              </button>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$50K</span>
              <span>$500K</span>
            </div>
            
            {/* Free Cash Flow Definition */}
            <div className="mt-3 bg-white rounded-lg p-3 border border-blue-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-1">What is Free Cash Flow?</div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Free cash flow is your business's net income after all operating expenses, 
                    taxes, and other obligations. It's the cash available to service debt and 
                    make investments. Lenders use this to determine your ability to afford 
                    mortgage payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Property Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Property Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Office', 'Industrial', 'Flex'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setPropertyType(type);
                    if (type !== 'Office') setOfficeSubtype('');
                  }}
                  className={`py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                    propertyType === type
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          
          {/* Office Subtype Selection */}
          {propertyType === 'Office' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Office Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'standalone-office', label: 'Standalone Office' },
                  { value: 'standalone-medical', label: 'Standalone Medical' },
                  { value: 'office-condo', label: 'Office Condo' },
                  { value: 'medical-condo', label: 'Medical Condo' }
                ].map((subtype) => (
                  <button
                    key={subtype.value}
                    onClick={() => setOfficeSubtype(subtype.value)}
                    className={`py-3 px-3 rounded-lg font-medium text-xs transition-all ${
                      officeSubtype === subtype.value
                        ? 'bg-teal-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subtype.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Square Footage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              Square Footage: <span className="text-2xl font-bold text-teal-600">{squareFootage.toLocaleString()}</span> SF
            </label>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setSquareFootage(Math.max(1250, squareFootage - 250))}
                className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-teal-700 active:scale-95 transition-all"
                disabled={squareFootage <= 1250}
              >
                <span className="text-xl font-bold">←</span>
              </button>
              
              <input
                type="range"
                min="1250"
                max="40000"
                step="250"
                value={squareFootage}
                onChange={(e) => setSquareFootage(Number(e.target.value))}
                className="flex-1 h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              
              <button
                onClick={() => setSquareFootage(Math.min(40000, squareFootage + 250))}
                className="flex-shrink-0 w-10 h-10 bg-teal-600 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-teal-700 active:scale-95 transition-all"
                disabled={squareFootage >= 40000}
              >
                <span className="text-xl font-bold">→</span>
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1,250 SF</span>
              <span>40,000 SF</span>
            </div>
          </div>
          
          {/* DCR Ratio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              Debt Coverage Ratio (DCR): {dcrRatio.toFixed(2)}x
            </label>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setDcrRatio(Math.max(1.20, Number((dcrRatio - 0.01).toFixed(2))))}
                className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
                disabled={dcrRatio <= 1.20}
              >
                <span className="text-xl font-bold">←</span>
              </button>
              
              <input
                type="range"
                min="1.20"
                max="1.25"
                step="0.01"
                value={dcrRatio}
                onChange={(e) => setDcrRatio(Number(e.target.value))}
                className="flex-1 h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              
              <button
                onClick={() => setDcrRatio(Math.min(1.25, Number((dcrRatio + 0.01).toFixed(2))))}
                className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
                disabled={dcrRatio >= 1.25}
              >
                <span className="text-xl font-bold">→</span>
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1.20x</span>
              <span>1.25x</span>
            </div>
          </div>
          
          {/* Down Payment Percentage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              Down Payment: {downPaymentPercent}%
            </label>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setDownPaymentPercent(Math.max(5, downPaymentPercent - 5))}
                className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-green-700 active:scale-95 transition-all"
                disabled={downPaymentPercent <= 5}
              >
                <span className="text-xl font-bold">←</span>
              </button>
              
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              
              <button
                onClick={() => setDownPaymentPercent(Math.min(30, downPaymentPercent + 5))}
                className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-green-700 active:scale-95 transition-all"
                disabled={downPaymentPercent >= 30}
              >
                <span className="text-xl font-bold">→</span>
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5% (SBA)</span>
              <span>30% (Conv)</span>
            </div>
          </div>
          
          {/* Amortization Term */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              Amortization: {amortYears} years
            </label>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setAmortYears(Math.max(10, amortYears - 5))}
                className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-purple-700 active:scale-95 transition-all"
                disabled={amortYears <= 10}
              >
                <span className="text-xl font-bold">←</span>
              </button>
              
              <input
                type="range"
                min="10"
                max="30"
                step="5"
                value={amortYears}
                onChange={(e) => setAmortYears(Number(e.target.value))}
                className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              
              <button
                onClick={() => setAmortYears(Math.min(30, amortYears + 5))}
                className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-purple-700 active:scale-95 transition-all"
                disabled={amortYears >= 30}
              >
                <span className="text-xl font-bold">→</span>
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10 years</span>
              <span>30 years</span>
            </div>
          </div>
          
          {/* Interest Rate */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
              Interest Rate: {interestRate.toFixed(2)}%
            </label>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setInterestRate(Math.max(5, Number((interestRate - 0.25).toFixed(2))))}
                className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-orange-700 active:scale-95 transition-all"
                disabled={interestRate <= 5}
              >
                <span className="text-xl font-bold">←</span>
              </button>
              
              <input
                type="range"
                min="5"
                max="10"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="flex-1 h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              
              <button
                onClick={() => setInterestRate(Math.min(10, Number((interestRate + 0.25).toFixed(2))))}
                className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-orange-700 active:scale-95 transition-all"
                disabled={interestRate >= 10}
              >
                <span className="text-xl font-bold">→</span>
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5.0%</span>
              <span>10.0%</span>
            </div>
          </div>
          
          {/* Results Section */}
          {propertyType && (propertyType !== 'Office' || officeSubtype) && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border-2 border-emerald-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                What You Can Afford
              </h2>
              
              <div className="space-y-3">
                {/* Maximum Purchase Price - Highlighted */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-4 shadow-lg text-white">
                  <div className="text-xs font-medium mb-1 text-emerald-100">Maximum Purchase Price</div>
                  <div className="text-3xl font-bold">
                    {formatCurrency(maxPurchasePrice)}
                  </div>
                </div>
                
                {/* Required Down Payment */}
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-600 font-medium">Required Down Payment ({downPaymentPercent}%)</div>
                  <div className="text-xl font-bold text-gray-900">{formatCurrency(requiredDownPayment)}</div>
                </div>
                
                {/* Maximum Loan Amount */}
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-600 font-medium">Maximum Loan Amount</div>
                  <div className="text-xl font-bold text-gray-900">{formatCurrency(maxLoanAmount)}</div>
                </div>
                
                {/* Monthly Breakdown */}
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-600 font-medium mb-2">Monthly Cash Flow Analysis</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Free Cash Flow:</span>
                      <span className="font-semibold text-emerald-600">{formatCurrency(annualFreeCashFlow)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Annual Expenses (÷ {dcrRatio}):</span>
                      <span className="font-semibold">{formatCurrency(maxAnnualExpenses)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 pt-1">
                      <span>Monthly equivalent:</span>
                      <span>{formatCurrencyDecimal(maxMonthlyExpenses)}</span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mortgage (P&I):</span>
                      <span className="font-semibold">{formatCurrencyDecimal(monthlyMortgage)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Operating Expenses:</span>
                      <span className="font-semibold">{formatCurrencyDecimal(monthlyOpex)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t-2 border-gray-200">
                      <span className="text-gray-800 font-semibold">Total Monthly:</span>
                      <span className="font-bold text-blue-600">{formatCurrencyDecimal(monthlyMortgage + monthlyOpex)}</span>
                    </div>
                  </div>
                </div>
                
                {/* OpEx Rate Display */}
                <div className="text-xs text-gray-600 text-center pt-2">
                  Operating expenses: ${getOpexRate().toFixed(2)}/SF/year
                </div>
              </div>
            </div>
          )}
          
          {/* Instructions */}
          {!propertyType && (
            <div className="text-center text-gray-500 py-8">
              <Building2 className="w-16 h-16 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Select a property type to see what you can afford</p>
            </div>
          )}
          
          {propertyType === 'Office' && !officeSubtype && (
            <div className="text-center text-gray-500 py-8">
              <Home className="w-16 h-16 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Select an office type to continue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}