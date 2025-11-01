require 'rails_helper'

RSpec.describe Transaction, type: :model do
  subject { build(:transaction) }

  describe 'Validations' do
    it { should validate_presence_of(:summary) }
    it { should validate_presence_of(:value) }
    it { should validate_presence_of(:date) }
  end

  describe 'Factory' do
    it 'Has a valid factory' do
      expect(build(:transaction)).to be_valid
    end
  end
end
