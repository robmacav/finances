class ExpenseCategory < ApplicationRecord
    belongs_to :user

    def self.ransackable_attributes(auth_object = nil)
        ["description", "color"]
    end

    before_create :generate_random_attribute_color

    private

    def generate_random_attribute_color
      self.color = SecureRandom.hex(3)
    end
end
