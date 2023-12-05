class Expense < ApplicationRecord
  belongs_to :expense_category
  belongs_to :card, optional: true
  belongs_to :user
  has_many :items, class_name: "ExpenseItem", dependent: :destroy

  accepts_nested_attributes_for :items, allow_destroy: true

  before_save :valid_payment_method

  validates_presence_of :description, :date

  scope :all_by_current_user, ->(user) { where(user_id: user.id) }
  scope :all_by_current_month_year, -> { where("date like ?", "%#{Date.today.strftime("%m%Y")}%") }

  scope :all_by_current_month_year_sum, -> { where("date like ?", "%#{Date.today.strftime("%m%Y")}%").sum(:value) }

  scope :all_by_current_month_year_with_credit_card_sum, -> { where("date like ? and payment_method = ?", "%#{Date.today.strftime("%m%Y")}%", 1)
                                                              .sum(:value)
                                                            }

  enum payment_method: {
    'Cartão de Débito': 0,
    'Cartão de Crédito': 1,
    'Dinheiro': 2
  }

  def calculate_total
    total = 0

    items.each do |item|
        if item.quantity.present? and item.value.present?
            total = total + (item.quantity * item.value)
        end
    end

    self.value = total
end

  def self.ransackable_associations(auth_object = nil)
    ["category", "user"]
  end

  def self.ransackable_attributes(auth_object = nil)
    ["description", "date"]
  end

  private

  def valid_payment_method
    if self.payment_method != 'Cartão de Crédito'
      self.card_id = nil
    end
  end
end
