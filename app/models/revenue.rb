class Revenue < ApplicationRecord
  belongs_to :user

  validates_presence_of :description, :value, :date

  scope :current_month_year, -> { where("date like ?", "%#{Time.now.strftime("%m%Y")}%") }

  def self.ransackable_associations(auth_object = nil)
    ["user"]
  end

  def self.ransackable_attributes(auth_object = nil)
    ["description", "date"]
  end
end