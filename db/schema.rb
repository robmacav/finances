# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_12_19_203842) do
  create_table "cards", force: :cascade do |t|
    t.string "description", null: false
    t.decimal "limit", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_cards_on_user_id"
  end

  create_table "expense_categories", force: :cascade do |t|
    t.string "description", null: false
    t.string "color", limit: 6, null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_expense_categories_on_user_id"
  end

  create_table "expense_items", force: :cascade do |t|
    t.integer "quantity", default: 1, null: false
    t.string "description", null: false
    t.decimal "value", null: false
    t.integer "expense_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["expense_id"], name: "index_expense_items_on_expense_id"
  end

  create_table "expenses", force: :cascade do |t|
    t.string "description", null: false
    t.decimal "value", default: "0.0", null: false
    t.integer "payment_method", null: false
    t.string "date", limit: 8, null: false
    t.integer "expense_category_id", null: false
    t.integer "card_id"
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "tag_id"
    t.index ["card_id"], name: "index_expenses_on_card_id"
    t.index ["expense_category_id"], name: "index_expenses_on_expense_category_id"
    t.index ["tag_id"], name: "index_expenses_on_tag_id"
    t.index ["user_id"], name: "index_expenses_on_user_id"
  end

  create_table "planning_expense_categories", force: :cascade do |t|
    t.string "description", null: false
    t.string "color", limit: 6, null: false
    t.integer "planning_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["planning_id"], name: "index_planning_expense_categories_on_planning_id"
  end

  create_table "planning_expenses", force: :cascade do |t|
    t.string "description", null: false
    t.decimal "value", null: false
    t.integer "planning_expense_category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["planning_expense_category_id"], name: "index_planning_expenses_on_planning_expense_category_id"
  end

  create_table "planning_incomes", force: :cascade do |t|
    t.string "description", null: false
    t.decimal "value", null: false
    t.integer "planning_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["planning_id"], name: "index_planning_incomes_on_planning_id"
  end

  create_table "plannings", force: :cascade do |t|
    t.string "month_year", limit: 6, null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_plannings_on_user_id"
  end

  create_table "revenues", force: :cascade do |t|
    t.string "description", null: false
    t.decimal "value", null: false
    t.string "date", limit: 8, null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_revenues_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "description", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_tags_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "status"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "cards", "users"
  add_foreign_key "expense_categories", "users"
  add_foreign_key "expense_items", "expenses"
  add_foreign_key "expenses", "cards"
  add_foreign_key "expenses", "expense_categories"
  add_foreign_key "expenses", "tags"
  add_foreign_key "expenses", "users"
  add_foreign_key "planning_expense_categories", "plannings"
  add_foreign_key "planning_expenses", "planning_expense_categories"
  add_foreign_key "planning_incomes", "plannings"
  add_foreign_key "plannings", "users"
  add_foreign_key "revenues", "users"
  add_foreign_key "tags", "users"
end
