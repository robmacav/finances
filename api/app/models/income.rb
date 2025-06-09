class Income < ApplicationRecord
    validates_presence_of :summary, :value, :date

    belongs_to :user, class_name: 'User', foreign_key: 'user_id'
    belongs_to :category, class_name: 'Category', foreign_key: 'category_id'
end
