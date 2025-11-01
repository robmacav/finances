require 'rails_helper'

RSpec.describe Category, type: :model do
  subject { build(:category) }

  describe 'Validations' do
    it { should validate_presence_of(:summary) }
    it { should validate_presence_of(:icon) }
  end

  describe 'Factory' do
    it 'Has a valid factory' do
      expect(build(:category)).to be_valid
    end
  end
end
