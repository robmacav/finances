class Transaction < ApplicationRecord
    validates_presence_of :summary, :value, :date

    belongs_to :status, class_name: 'Status', foreign_key: 'status_id', optional: true
    belongs_to :user, class_name: 'User', foreign_key: 'user_id', optional: true
    belongs_to :category, class_name: 'Category', foreign_key: 'category_id', optional: true

    enum :kind, { expense: 1, income: 2 }
end