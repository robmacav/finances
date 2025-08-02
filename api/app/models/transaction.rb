class Transaction < ApplicationRecord
    validates_presence_of :summary, :value, :date

    belongs_to :kind, class_name: 'TransactionKind', foreign_key: 'transaction_kind_id', optional: true
    belongs_to :status, class_name: 'Status', foreign_key: 'status_id', optional: true
    belongs_to :user, class_name: 'User', foreign_key: 'user_id', optional: true
    belongs_to :category, class_name: 'Category', foreign_key: 'category_id', optional: true

    scope :all_by_month_year, ->(month_year) { 
        includes(:category, :status).where(date: date_range_by_month_year_string(month_year)).order(date: :asc, summary: :asc)
    }

    private

    def self.date_range_by_month_year_string(month_year)
        formatted = "#{month_year[0..1]}/#{month_year[2..5]}"

        start_date = Date.strptime(formatted, "%m/%Y")

        end_date = start_date.end_of_month

        start_date..end_date
    end
end