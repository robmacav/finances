class Expense < ApplicationRecord
    validates_presence_of :summary, :value, :date

    belongs_to :status, class_name: 'Status', foreign_key: 'status_id', optional: true
    belongs_to :user, class_name: 'User', foreign_key: 'user_id', optional: true
    belongs_to :category, class_name: 'Category', foreign_key: 'category_id', optional: true

    scope :all_by_month_year, ->(month_year) { 
        includes(:category, :status).where(date: date_range_by_month_year_string(month_year)).order(date: :asc, summary: :asc)
    }

    scope :all_by_month_year_sum, ->(month_year) {
        where(date: date_range_by_month_year_string(month_year)).sum(:value)
    }

    scope :current_year_total_months, -> {
        where("EXTRACT(YEAR FROM date) = ?", Date.today.year)
        .select("TO_CHAR(date, 'MM/YYYY') AS month_year, SUM(value) AS total")
        .group("TO_CHAR(date, 'MM/YYYY')")
        .order("TO_CHAR(date, 'MM/YYYY') ASC")
    }

    scope :all_by_month_year_by_category, ->(month_year) {
        where(date: date_range_by_month_year_string(month_year))
        .select("category_id, SUM(value) as total")
        .group("category_id")
        .order("total desc")
        .joins(:category)
    }

    scope :total_months_by_year, ->(year) {
        where("EXTRACT(YEAR FROM date) = ?", year)
        .select("TO_CHAR(date, 'MM/YYYY') AS month_year, SUM(value) AS total")
        .group("TO_CHAR(date, 'MM/YYYY')")
        .order("month_year ASC")
    }


    scope :all_current_week_total_by_day, -> {
        start_date = Date.today.beginning_of_week(:monday)
        end_date = Date.today.end_of_week(:sunday)

        select("TO_CHAR(date, 'Day') AS day_name, SUM(value) AS total")
        .where(date: start_date..end_date)
        .group("day_name")
        .order(Arel.sql("MIN(date)"))
    }


    scope :most_frequents_on_current_month, ->(month_year) {
        where(date: date_range_by_month_year_string(month_year))
        .select("summary, COUNT(*) AS qtd, SUM(value) AS total")
        .group(:summary)
        .order("qtd DESC")
    }

    private

    def self.date_range_by_month_year_string(month_year)
        formatted = "#{month_year[0..1]}/#{month_year[2..5]}"

        start_date = Date.strptime(formatted, "%m/%Y")

        end_date = start_date.end_of_month

        start_date..end_date
    end

    # def as_json(options = {})
    #     {
    #         id: id,
    #         summary: summary,
    #         details: details,
    #         value: "R$ #{value}",

    #         date: {
    #             full: Date.strptime(date, "%d%m%Y").strftime("%d/%m/%Y"),
    #             day: Date.strptime(date, "%d%m%Y").day,
    #             month: Date.strptime(date, "%d%m%Y").month,
    #             year: Date.strptime(date, "%d%m%Y").year
    #         },

    #         status: {
    #             id: status&.id,
    #             summary: status&.summary
    #         },

    #         category: {
    #             id: category.id,
    #             summary: category.summary,
    #             color: category.color
    #         }
    #     }
    # end
end
