class Income < ApplicationRecord
    validates_presence_of :summary, :value, :date

    belongs_to :status, class_name: 'Status', foreign_key: 'status_id'
    belongs_to :user, class_name: 'User', foreign_key: 'user_id'
    belongs_to :category, class_name: 'Category', foreign_key: 'category_id'

    def as_json(options = {})
        {
        id: id,
        summary: summary,
        details: details,
        value: value,
        date: date,
        status: {
            id: status.id,
            summary: status.summary
        },
        category: {
            id: category.id,
            summary: category.summary,
            color: category.color
        },
        user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name
        }
        }
    end
end
