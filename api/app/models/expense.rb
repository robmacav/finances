class Expense < ApplicationRecord
    validates_presence_of :summary, :value, :date

    belongs_to :status, class_name: 'Status', foreign_key: 'status_id'
    belongs_to :user, class_name: 'User', foreign_key: 'user_id'
    belongs_to :category, class_name: 'Category', foreign_key: 'category_id'

    scope :all_by_month_year, ->(month_year) { 
        where("date like '%#{month_year}'") 
    }

    scope :all_by_month_year_sum, ->(month_year) {
        where("date like ?", "%#{month_year}%").sum(:value)
    }

    scope :current_year_total_months, -> { 
        where("date LIKE ?", "%#{Date.today.year}")
        .select("SUBSTR(date, 3, 6) AS month_year, SUM(value) as total")
        .group("SUBSTR(date, 3, 6)") 
        .order(month_year: :asc)
    }

    def as_json(options = {})
        {
            id: id,
            summary: summary,
            details: details,
            value: "R$ #{value}",

            date: {
                full: Date.strptime(date, "%d%m%Y").strftime("%d/%m/%Y"),
                day: Date.strptime(date, "%d%m%Y").day,
                month: Date.strptime(date, "%d%m%Y").month,
                year: Date.strptime(date, "%d%m%Y").year
            },

            status: {
                id: status&.id,
                summary: status&.summary
            },

            category: {
                id: category.id,
                summary: category.summary,
                color: category.color
            }
        }
    end
end
