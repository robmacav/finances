class Tag < ApplicationRecord
  belongs_to :user
  has_many :expenses

  validates_presence_of :description

  scope :all_by_current_user, ->(user) { where(user_id: user.id) }
end
