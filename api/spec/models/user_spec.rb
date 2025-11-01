require 'rails_helper'

RSpec.describe User, type: :model do
  subject { build(:user) } # Usa a factory como base

  describe 'Validations' do
    it { should validate_presence_of(:first_name) }
    it { should validate_presence_of(:last_name) }
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }
  end

  describe 'Factory' do
    it 'Has a valid factory' do
      expect(build(:user)).to be_valid
    end
  end
end
