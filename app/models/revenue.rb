class Revenue < ApplicationRecord
  belongs_to :user

  validates_presence_of :description, :value, :date

  scope :current_month_year, -> { where("date like ?", "%#{Time.now.strftime("%m%Y")}%") }

  scope :all_by_current_month_year_sum, -> { where("date like ?", "%#{Date.today.strftime("%m%Y")}%").sum(:value) }
end
