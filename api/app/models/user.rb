class User < ApplicationRecord
    validates_presence_of :first_name, :last_name
    validates :email, presence: true, uniqueness: true

    has_many :categories, class_name: 'Category', foreign_key: 'user_id', dependent: :destroy
    has_many :incomes, class_name: 'Income', foreign_key: 'user_id', dependent: :destroy
    has_many :expenses, class_name: 'Expense', foreign_key: 'user_id', dependent: :destroy
end
