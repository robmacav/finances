class PlanningIncome < ApplicationRecord
  belongs_to :planning, optional: true

  validates_presence_of :description, :value
end
