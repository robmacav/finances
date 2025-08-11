class Transaction < ApplicationRecord
    validates_presence_of :summary, :value, :date

    belongs_to :status, class_name: 'Status', foreign_key: 'status_id', optional: true
    belongs_to :user, class_name: 'User', foreign_key: 'user_id', optional: true
    belongs_to :category, class_name: 'Category', foreign_key: 'category_id', optional: true

    enum :kind, { expense: 1, income: 2 }

    scope :by_month_year, ->(month_year) {
        includes(:category, :status)
        .where(date: date_range_by_month_year_string(month_year))
        .order(date: :asc, summary: :asc)
    }

    scope :by_kind_and_month_year, ->(kind, month_year) {
        includes(:category, :status)
        .where(kind: kind, date: date_range_by_month_year_string(month_year))
        .order(date: :asc, summary: :asc)
    }

    scope :sum_by_kind_and_month_year, ->(kind, month_year) {
        where(kind: kind, date: date_range_by_month_year_string(month_year)).sum(:value)
    }

    scope :by_kind_and_month_year_per_category, ->(kind, month_year) {
        where(kind: kind, date: date_range_by_month_year_string(month_year))
        .select("category_id, SUM(value) as total")
        .group("category_id")
        .order("total desc")
        .includes(:category)
    }

    scope :total_months_by_kind_per_year, ->(kind, year) {
        where(kind: kind, date: Date.new(year).beginning_of_year..Date.new(year).end_of_year)
        .select("TO_CHAR(date, 'TMMon') AS month, SUM(value) AS total")
        .group("month")
        .order("MIN(date)")
    }

    scope :by_month_year_expenses_most_frequents, ->(month_year) {
        where(kind: :expense, date: date_range_by_month_year_string(month_year))
        .select("summary, COUNT(*) AS qtd, SUM(value) AS total")
        .group(:summary)
        .order("qtd DESC")
    }

    scope :expenses_on_current_week_total_by_day, -> {
        start_date = Date.today.beginning_of_week(:monday)
        end_date = Date.today.end_of_week(:sunday)

        select("TO_CHAR(date, 'Day') AS day_name, SUM(value) AS total")
        .where(kind: :expense, date: start_date..end_date)
        .group("day_name")
        .order(Arel.sql("MIN(date)"))
    }

    def format_brazilian_currency
        whole, decimal = sprintf('%.2f', value).split(".")

        whole_with_delimiter = whole.reverse.gsub(/(\d{3})(?=\d)/, '\\1.').reverse
       
        "#{whole_with_delimiter},#{decimal}"
    end

    private

    def self.date_range_by_month_year_string(month_year)
        formatted = "#{month_year[0..1]}/#{month_year[2..5]}"

        start_date = Date.strptime(formatted, "%m/%Y")

        end_date = start_date.end_of_month

        start_date..end_date
    end
end