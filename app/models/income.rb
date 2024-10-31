class Income < ApplicationRecord
    belongs_to :user

    scope :current_month_year, -> { where("date like ?", "%#{Time.now.strftime("%m%Y")}%") }

    def self.ransackable_attributes(auth_object = nil)
        ["description", "value", "date"]
    end
end
