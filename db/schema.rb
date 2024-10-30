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

ActiveRecord::Schema[7.2].define(version: 2024_10_30_121033) do
  create_table "cards", force: :cascade do |t|
    t.string "description", null: false
    t.decimal "limit"
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
    t.decimal "value"
    t.integer "expense_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["expense_id"], name: "index_expense_items_on_expense_id"
  end

  create_table "expenses", force: :cascade do |t|
    t.string "description", null: false
    t.decimal "value", default: "0.0"
    t.integer "payment_method"
    t.string "date", limit: 8
    t.integer "expense_category_id"
    t.integer "card_id"
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["card_id"], name: "index_expenses_on_card_id"
    t.index ["expense_category_id"], name: "index_expenses_on_expense_category_id"
    t.index ["user_id"], name: "index_expenses_on_user_id"
  end

  create_table "incomes", force: :cascade do |t|
    t.string "description", null: false
    t.decimal "value"
    t.string "date", limit: 8
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_incomes_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "cards", "users"
  add_foreign_key "expense_categories", "users"
  add_foreign_key "expense_items", "expenses"
  add_foreign_key "expenses", "cards"
  add_foreign_key "expenses", "expense_categories"
  add_foreign_key "expenses", "users"
  add_foreign_key "incomes", "users"
end
