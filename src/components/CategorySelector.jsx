import { WORD_CATEGORIES } from '../data/twiWords';

const CategorySelector = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Difficulty Level</h2>
        
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(WORD_CATEGORIES).map(([key, category]) => (
            <button
              key={key}
              onClick={() => onSelectCategory(key)}
              className={`p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${
                selectedCategory === key
                  ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg scale-105'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              <span className="text-3xl">{category.emoji}</span>
              <div>
                <p className="font-bold text-lg">{category.label}</p>
                <p className="text-sm opacity-75">{category.description}</p>
              </div>
              {selectedCategory === key && (
                <span className="ml-auto text-xl">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;
