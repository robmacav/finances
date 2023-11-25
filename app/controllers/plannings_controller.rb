class PlanningsController < ApplicationController
  def index
    @plannings = Planning.all
  end
end
