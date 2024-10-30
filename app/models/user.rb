class User < ApplicationRecord
    has_many :cards, dependent: :destroy
    has_many :expense_categories, dependent: :destroy
    has_many :expenses, dependent: :destroy
    has_many :income, dependent: :destroy
end
