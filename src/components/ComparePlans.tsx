import React from 'react';

interface Feature {
  text: string;
  value: string | number | boolean;
  type?: 'basic' | 'improved' | 'best' | 'included' | 'not-included';
}

interface Plan {
  name: string;
  price: string;
  features: Feature[];
}

const plans: Plan[] = [
  {
    name: "Standard",
    price: "0",
    features: [
      { text: "Price (USD)", value: "0" },
      { text: "Subscription Penetration Rate", value: "50%" },
      { text: "International Transfer Fee", value: "4.00%" },
      { text: "Transaction Limit", value: "-" },
      { text: "Free Transfers to Other Accounts", value: "-" },
      { text: "FX Conversion Rate No Additional Fees", value: "-" },
      { text: "Interest on Savings Account", value: "x", type: "included" },
      { text: "Virtual/Physical Card", value: "-" },
      { text: "Customized Card", value: "-" },
      { text: "Credit Card (Phase 2)", value: "-" },
      { text: "Partner Subscriptions", value: "-" },
      { text: "Travel Insurance", value: "-" },
      { text: "VIP Airport Access", value: "-" },
      { text: "Benefits & Discounts (Experiences)", value: "x", type: "included" },
      { text: "Transferable Benefits", value: "-" },
      { text: "Customer Support", value: "x", type: "included" },
      { text: "Instant Savings Account", value: "x", type: "included" },
      { text: "Youth Accounts with Co-Parents (Phase 2)", value: "-" },
      { text: "VIP Events", value: "-" }
    ]
  },
  {
    name: "Plus",
    price: "4.99",
    features: [
      { text: "Price (USD)", value: "4.99" },
      { text: "Subscription Penetration Rate", value: "30%" },
      { text: "International Transfer Fee", value: "3.50%" },
      { text: "Transaction Limit", value: "-" },
      { text: "Free Transfers to Other Accounts", value: "-" },
      { text: "FX Conversion Rate No Additional Fees", value: "-" },
      { text: "Interest on Savings Account", value: "x", type: "included" },
      { text: "Virtual/Physical Card", value: "x", type: "included" },
      { text: "Customized Card", value: "-" },
      { text: "Credit Card (Phase 2)", value: "-" },
      { text: "Partner Subscriptions", value: "x", type: "included" },
      { text: "Travel Insurance", value: "-" },
      { text: "VIP Airport Access", value: "-" },
      { text: "Benefits & Discounts (Experiences)", value: "x", type: "included" },
      { text: "Transferable Benefits", value: "x", type: "included" },
      { text: "Customer Support", value: "Personalized in app", type: "improved" },
      { text: "Instant Savings Account", value: "x", type: "included" },
      { text: "Youth Accounts with Co-Parents (Phase 2)", value: "-" },
      { text: "VIP Events", value: "-" }
    ]
  },
  {
    name: "Premium",
    price: "7.99",
    features: [
      { text: "Price (USD)", value: "7.99" },
      { text: "Subscription Penetration Rate", value: "20%" },
      { text: "International Transfer Fee", value: "3.00%" },
      { text: "Transaction Limit", value: "-" },
      { text: "Free Transfers to Other Accounts", value: "x", type: "included" },
      { text: "FX Conversion Rate No Additional Fees", value: "x", type: "included" },
      { text: "Interest on Savings Account", value: "x", type: "included" },
      { text: "Virtual/Physical Card", value: "x", type: "included" },
      { text: "Customized Card", value: "x", type: "included" },
      { text: "Credit Card (Phase 2)", value: "x", type: "included" },
      { text: "Partner Subscriptions", value: "x", type: "included" },
      { text: "Travel Insurance", value: "-" },
      { text: "VIP Airport Access", value: "-" },
      { text: "Benefits & Discounts (Experiences)", value: "x", type: "included" },
      { text: "Transferable Benefits", value: "x", type: "included" },
      { text: "Customer Support", value: "Personalized in app", type: "best" },
      { text: "Instant Savings Account", value: "x", type: "included" },
      { text: "Youth Accounts with Co-Parents (Phase 2)", value: "x", type: "included" },
      { text: "VIP Events", value: "x", type: "included" }
    ]
  }
];

const ComparePlans: React.FC = () => {
  const highlightColumn = (th: HTMLElement) => {
    const table = th.closest('table');
    const index = Array.from(th.parentElement?.children || []).indexOf(th);
    const cells = table?.querySelectorAll(`td:nth-child(${index + 1}), th:nth-child(${index + 1})`);
    
    // Resetear todas las columnas
    table?.querySelectorAll('td, th')?.forEach(cell => {
      cell.classList.remove('bg-blue-50/50', 'opacity-40');
    });
    
    // Si la columna ya estaba resaltada, solo resetear
    if (th.classList.contains('highlighted')) {
      th.classList.remove('highlighted');
      return;
    }
    
    // Resaltar la columna seleccionada y atenuar las demás
    table?.querySelectorAll('td, th')?.forEach(cell => {
      cell.classList.add('opacity-40');
    });
    
    cells?.forEach(cell => {
      cell.classList.remove('opacity-40');
      cell.classList.add('bg-blue-50/50');
    });
    
    th.classList.add('highlighted');
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-tl-xl">
              Features
            </th>
            {plans.map((plan, idx) => (
              <th 
                key={plan.name}
                className={`px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer transition-colors hover:bg-blue-200/50 ${
                  idx === plans.length - 1 ? 'rounded-tr-xl' : ''
                }`}
                onClick={(e) => highlightColumn(e.currentTarget)}
              >
                <div className="flex flex-col">
                  <span className="text-lg">{plan.name}</span>
                  <span className="text-blue-600 font-bold mt-1">${plan.price}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {plans[0].features.map((feature, index) => (
            <tr 
              key={index}
              className="transition-colors hover:bg-blue-50/50 group"
            >
              <td className="px-6 py-4 text-sm text-gray-600 font-medium group-hover:text-gray-900">
                {feature.text}
              </td>
              {plans.map((plan) => (
                <td 
                  key={`${plan.name}-${index}`} 
                  className="px-6 py-4 text-sm"
                >
                  <span className={`inline-flex items-center ${
                    plan.features[index].type === 'included' ? 'text-green-600' :
                    plan.features[index].type === 'not-included' ? 'text-red-600' :
                    plan.features[index].type === 'improved' ? 'text-blue-600' :
                    plan.features[index].type === 'best' ? 'text-purple-600' :
                    'text-gray-700'
                  } font-medium group-hover:scale-105 transition-transform`}>
                    {plan.features[index].value === 'x' ? (
                      <>
                        <i className="eva eva-checkmark-circle-2 mr-2 text-lg"></i>
                        <span>Included</span>
                      </>
                    ) : plan.features[index].value === '-' ? (
                      <i className="eva eva-close-circle text-lg opacity-50"></i>
                    ) : (
                      <span className="font-semibold">{plan.features[index].value}</span>
                    )}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparePlans; 