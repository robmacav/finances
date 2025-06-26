class Expense < ApplicationRecord
    validates_presence_of :summary, :value, :date

    belongs_to :status, class_name: 'Status', foreign_key: 'status_id'
    belongs_to :user, class_name: 'User', foreign_key: 'user_id'
    belongs_to :category, class_name: 'Category', foreign_key: 'category_id'
end
