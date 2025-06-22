function $(id)
{
    return document.getElementById(id)
}

let relationship_status = "none"
let weekly_salary = 0
let salary = 0
let PAYE = 0
let USC = 0
let PRSI = 0
let taxCredit = 0
let remainder = 0

const NUMBER_OF_MONTHS = 12 //12 months
const NUMBER_OF_WEEKS = 52 //52 weeks
const NUMBER_OF_WORKING_DAYS = 260 //260 working days

const PAYE_STANDARD_RATE = 0.2 //20%
const PAYE_HIGHER_RATE = 0.4 //40%

const PRSI_RATE = 0.041 //4.1%
const PRSI_CREDIT = 12 //12 Euro

const USC_RATE1 = 0.005 //0.5%
const USC_RATE2 = 0.02 //2%
const USC_RATE3 = 0.04 //4%
const USC_RATE4 = 0.08 //8%
const USC_RATE5 = 0.11 //11%

const USC_CUT_OFF = 13000 //13000 Euro
const USC_CUT_OFF_POINT1 = 12012 //12012 Euro
const USC_CUT_OFF_POINT2 = 25760 //25760 Euro
const USC_CUT_OFF_POINT3 = 70044 //70044 Euro
const USC_CUT_OFF_POINT4 = 100000 //100000 Euro

const SINGLE_CUT_OFF_POINT = 42000 //42000 Euro
const ONE_PARENT_CUT_OFF_POINT = 46000 //46000 Euro
const ONE_INCOME_CUT_OFF_POINT = 51000 //51000 Euro
const TWO_INCOME_CUT_OFF_POINT = 51000 + 33000 //84000

const EMPLOYEE_TAX_CREDIT = 1875
const SINGLE_TAX_CREDIT = 1875
const MARRIED_TAX_CREDIT = 3750
const SINGLE_PERSON_CHILD_CARER_TAX_CREDIT = 1750

window.onload = function()
{
    $("status").onchange = function()
    {
        calculateSalary()
    }

    $("salary").oninput = function()
    {
        validateInput("salary")
    }

/*
    $("taxCredit").oninput = function()
    {
        validateInput("taxCredit")
    }
*/

    $("calculate_button").onclick = function()
    {
        printIncomeTable()
    }

    $("clear_button").onclick = function()
    {
        clearIncomeTable()
    }
}

function calculateSalary()
{
    relationship_status = $("status").value
    salary = $("salary").value

    if(relationship_status == "single")
    {
        taxCredit = EMPLOYEE_TAX_CREDIT + SINGLE_TAX_CREDIT
    }
    else if(relationship_status == "oneParent")
    {
        taxCredit = EMPLOYEE_TAX_CREDIT + SINGLE_TAX_CREDIT + SINGLE_PERSON_CHILD_CARER_TAX_CREDIT
    }
    if(relationship_status == "oneIncome" || relationship_status == "twoIncome")
    {
        taxCredit = EMPLOYEE_TAX_CREDIT + MARRIED_TAX_CREDIT
    }
 
    //$("taxCredit").innerText = taxCredit
    
    calculatePAYE()
    calculatePRSI()
    calculateUSC()
    //printIncomeTable()


    //console.log(salary - (PAYE - taxCredit))
/*
    if (taxCredit <= PAYE)
    {
        salaryAfterTax = salary - (PAYE - taxCredit) - (PRSI * NUMBER_OF_WEEKS) - USC
    }
    else
    {
        salaryAfterTax = salary - (PRSI * NUMBER_OF_WEEKS) - USC
    }
    
    $("detail").innerText = "PAYE: " + PAYE + " Salary: " + salary + " Tax Credit: "
     + taxCredit + " PRSI: " + PRSI * NUMBER_OF_WEEKS + " Status: " + relationship_status + " USC: " + USC
    $("value").innerText = salaryAfterTax
*/
}

function calculatePAYE()
{
    if (relationship_status == "single")
    {
        if (salary <= SINGLE_CUT_OFF_POINT)
        {
            PAYE = salary * PAYE_STANDARD_RATE
        }
        else if (salary > SINGLE_CUT_OFF_POINT)
        {
            remainder = salary - SINGLE_CUT_OFF_POINT
            PAYE = ((salary - remainder) * PAYE_STANDARD_RATE) + (remainder * PAYE_HIGHER_RATE)
        }
    }
    else if (relationship_status == "oneParent")
    {
        if (salary <= ONE_PARENT_CUT_OFF_POINT)
        {
            PAYE = salary * PAYE_STANDARD_RATE
        }
        else if (salary > ONE_PARENT_CUT_OFF_POINT)
        {
            remainder = salary - ONE_PARENT_CUT_OFF_POINT
            PAYE = ((salary - remainder) * PAYE_STANDARD_RATE) + (remainder * PAYE_HIGHER_RATE)
        }
    }
    else if (relationship_status == "oneIncome")
    {
        if (salary <= ONE_INCOME_CUT_OFF_POINT)
        {
            PAYE = salary * PAYE_STANDARD_RATE
        }
        else if (salary > ONE_INCOME_CUT_OFF_POINT)
        {
            remainder = salary - ONE_INCOME_CUT_OFF_POINT
            PAYE = ((salary - remainder) * PAYE_STANDARD_RATE) + (remainder * PAYE_HIGHER_RATE)
        }
    }
    else if (relationship_status == "twoIncome")
    {
        if (salary <= TWO_INCOME_CUT_OFF_POINT)
        {
            PAYE = salary * PAYE_STANDARD_RATE
        }
        else if (salary > TWO_INCOME_CUT_OFF_POINT)
        {
            remainder = salary - TWO_INCOME_CUT_OFF_POINT
            PAYE = ((salary - remainder) * PAYE_STANDARD_RATE) + (remainder * PAYE_HIGHER_RATE)
        }
    }
}

function calculatePRSI()
{
    let weekly_salary = salary / 52

    if(weekly_salary < 352.01)
    {
        PRSI = 0
    }
    else if (weekly_salary == 352.01)
    {
        PRSI = (weekly_salary * PRSI_RATE) - PRSI_CREDIT
    }
    else if (weekly_salary > 352.01 && weekly_salary <= 424)
    {
        PRSI = (weekly_salary * PRSI_RATE) - (PRSI_CREDIT - ((weekly_salary - 352.01) / 6))
    }
    else if (weekly_salary > 424)
    {
        PRSI = weekly_salary * PRSI_RATE
    }

    /*if (PRSI <= 0)
    {
        PRSI = 0
    }*/
}

function calculateUSC()
{
    if (salary <= USC_CUT_OFF)
    {
        USC = 0
    }
    else if (salary > USC_CUT_OFF && salary <= USC_CUT_OFF_POINT2)
    {
        USC = (USC_CUT_OFF_POINT1 * USC_RATE1) + (salary - USC_CUT_OFF_POINT1) * USC_RATE2
    }
    else if (salary > USC_CUT_OFF_POINT2 && salary <= USC_CUT_OFF_POINT3)
    {
        USC = (USC_CUT_OFF_POINT1 * USC_RATE1) + ((USC_CUT_OFF_POINT2 - USC_CUT_OFF_POINT1) * USC_RATE2) +  ((salary - USC_CUT_OFF_POINT2) * USC_RATE3)
    }
    else if (salary > USC_CUT_OFF_POINT3)
    {
        USC = (USC_CUT_OFF_POINT1 * USC_RATE1) + ((USC_CUT_OFF_POINT2 - USC_CUT_OFF_POINT1) * USC_RATE2)
         +  ((USC_CUT_OFF_POINT3 - USC_CUT_OFF_POINT2) * USC_RATE3) + ((salary - USC_CUT_OFF_POINT3) * USC_RATE4)
    }
    //printIncomeTable()
}

function validateInput(id)
{
    let value = $(id).value

    if (isNaN(value) || value < 0 || value == "-")
    {
        //alert("Please enter a valid number!")
        $("error").classList.remove("hide")
        $("calculate_button").disabled = true
        $("clear_button").disabled = false
    }
    else if (value > 0)
    {
        $("error").classList.add("hide")
        $("calculate_button").disabled = false
        $("clear_button").disabled = true
        calculateSalary()
    }
}

function printIncomeTable()
{
    let net_tax = PAYE - taxCredit

    if (net_tax <= 0)
    {
        net_tax = 0
    }

    $("calculate_button").disabled = true
    $("clear_button").disabled = false

    let income_table = $("income_table")

    let new_row = document.createElement("tr")

    let row1_table = document.createElement("th")
    row1_table.innerText = " "
    let row2_table = document.createElement("th")
    row2_table.innerText = "Yearly"
    let row3_table = document.createElement("th")
    row3_table.innerText = " Monthly"
    let row4_table = document.createElement("th")
    row4_table.innerText = "Weekly"
    let row5_table = document.createElement("th")
    row5_table.innerText = "Daily"

    new_row.appendChild(row1_table)
    new_row.appendChild(row2_table)
    new_row.appendChild(row3_table)
    new_row.appendChild(row4_table)
    new_row.appendChild(row5_table)

    income_table.appendChild(new_row)

    //Gross Income
    let new_gross_income_row = document.createElement("tr")
    
    let gross_income_table = document.createElement("th")
    gross_income_table.innerText = "Gross Income"

    let yearly_income_table = document.createElement("td")
    yearly_income_table.innerText = salary
    
    let monthly_income_table = document.createElement("td")
    monthly_income_table.innerText = (salary / NUMBER_OF_MONTHS).toFixed(2)

    let weekly_income_table = document.createElement("td")
    weekly_income_table.innerText = (salary / NUMBER_OF_WEEKS).toFixed(2)

    let daily_income_table = document.createElement("td")
    daily_income_table.innerText = (salary / NUMBER_OF_WORKING_DAYS).toFixed(2)

    new_gross_income_row.appendChild(gross_income_table)
    new_gross_income_row.appendChild(yearly_income_table)
    new_gross_income_row.appendChild(monthly_income_table)
    new_gross_income_row.appendChild(weekly_income_table)
    new_gross_income_row.appendChild(daily_income_table)

    income_table.appendChild(new_gross_income_row);

    //Total Payable Tax (PAYE)
    let new_total_payable_tax_row = document.createElement("tr")
    
    let tax_payable_table = document.createElement("th")
    tax_payable_table.innerText = "Total Payable Tax (PAYE)"

    let total_tax_yearly_table = document.createElement("td")
    total_tax_yearly_table.innerText = (PAYE).toFixed(2)

    let total_tax_monthly_table = document.createElement("td")
    total_tax_monthly_table.innerText = (PAYE / NUMBER_OF_MONTHS).toFixed(2)

    let total_tax_weekly_table = document.createElement("td")
    total_tax_weekly_table.innerText = (PAYE / NUMBER_OF_WEEKS).toFixed(2)

    let total_tax_daily_table = document.createElement("td")
    total_tax_daily_table.innerText = (PAYE / NUMBER_OF_WORKING_DAYS).toFixed(2)

    new_total_payable_tax_row.appendChild(tax_payable_table)
    new_total_payable_tax_row.appendChild(total_tax_yearly_table)
    new_total_payable_tax_row.appendChild(total_tax_monthly_table)
    new_total_payable_tax_row.appendChild(total_tax_weekly_table)
    new_total_payable_tax_row.appendChild(total_tax_daily_table)

    income_table.appendChild(new_total_payable_tax_row)

    //Tax Credit
    let new_tax_credit_row = document.createElement("tr")
    
    let tax_credit_table = document.createElement("th")
    tax_credit_table.innerText = "Tax Credit"

    let yearly_tax_credit_table = document.createElement("td")
    yearly_tax_credit_table.innerText = taxCredit

    let monthly_tax_credit_table = document.createElement("td")
    monthly_tax_credit_table.innerText = (taxCredit / NUMBER_OF_MONTHS).toFixed(2)

    let weekly_tax_credit_table = document.createElement("td")
    weekly_tax_credit_table.innerText = (taxCredit / NUMBER_OF_WEEKS).toFixed(2)

    let daily_tax_credit_table = document.createElement("td")
    daily_tax_credit_table.innerText = (taxCredit / NUMBER_OF_WORKING_DAYS).toFixed(2)

    new_tax_credit_row.appendChild(tax_credit_table)
    new_tax_credit_row.appendChild(yearly_tax_credit_table)
    new_tax_credit_row.appendChild(monthly_tax_credit_table)
    new_tax_credit_row.appendChild(weekly_tax_credit_table)
    new_tax_credit_row.appendChild(daily_tax_credit_table)

    income_table.appendChild(new_tax_credit_row)

    //Net tax
    let new_net_tax_row = document.createElement("tr")
    
    let net_tax_table = document.createElement("th")
    net_tax_table.innerText = "Net tax"

    let yearly_net_tax_table = document.createElement("td")
    yearly_net_tax_table.innerText = (net_tax).toFixed(2)

    let monthly_net_tax_table = document.createElement("td")
    monthly_net_tax_table.innerText = ((net_tax) / NUMBER_OF_MONTHS).toFixed(2)

    let weekly_net_tax_table = document.createElement("td")
    weekly_net_tax_table.innerText = ((net_tax) / NUMBER_OF_WEEKS).toFixed(2)

    let daily_net_tax_table = document.createElement("td")
    daily_net_tax_table.innerText = ((net_tax) / NUMBER_OF_WORKING_DAYS).toFixed(2)

    new_net_tax_row.appendChild(net_tax_table)
    new_net_tax_row.appendChild(yearly_net_tax_table)
    new_net_tax_row.appendChild(monthly_net_tax_table)
    new_net_tax_row.appendChild(weekly_net_tax_table)
    new_net_tax_row.appendChild(daily_net_tax_table)

    income_table.appendChild(new_net_tax_row)

    //PRSI
    let new_PRSI_row = document.createElement("tr")
    
    let net_PRSI_table = document.createElement("th")
    net_PRSI_table.innerText = "PRSI"

    let yearly_PRSI_table = document.createElement("td")
    yearly_PRSI_table.innerText = (PRSI * NUMBER_OF_WEEKS).toFixed(2)

    let monthly_PRSI_table = document.createElement("td")
    monthly_PRSI_table.innerText = ((PRSI * NUMBER_OF_WEEKS) / NUMBER_OF_MONTHS).toFixed(2)

    let weekly_PRSI_table = document.createElement("td")
    weekly_PRSI_table.innerText = (PRSI).toFixed(2)

    let daily_PRSI_table = document.createElement("td")
    daily_PRSI_table.innerText = ((PRSI * NUMBER_OF_WEEKS) / NUMBER_OF_WORKING_DAYS).toFixed(2)

    new_PRSI_row.appendChild(net_PRSI_table)
    new_PRSI_row.appendChild(yearly_PRSI_table)
    new_PRSI_row.appendChild(monthly_PRSI_table)
    new_PRSI_row.appendChild(weekly_PRSI_table)
    new_PRSI_row.appendChild(daily_PRSI_table)

    income_table.appendChild(new_PRSI_row)

    //USC
    let new_USC_row = document.createElement("tr")
    
    let net_USC_table = document.createElement("th")
    net_USC_table.innerText = "USC"

    let yearly_USC_table = document.createElement("td")
    yearly_USC_table.innerText = (USC).toFixed(2)

    let monthly_USC_table = document.createElement("td")
    monthly_USC_table.innerText = (USC / NUMBER_OF_MONTHS).toFixed(2)

    let weekly_USC_table = document.createElement("td")
    weekly_USC_table.innerText = (USC / NUMBER_OF_WEEKS).toFixed(2)

    let daily_USC_table = document.createElement("td")
    daily_USC_table.innerText = (USC / NUMBER_OF_WORKING_DAYS).toFixed(2)

    new_USC_row.appendChild(net_USC_table)
    new_USC_row.appendChild(yearly_USC_table)
    new_USC_row.appendChild(monthly_USC_table)
    new_USC_row.appendChild(weekly_USC_table)
    new_USC_row.appendChild(daily_USC_table)

    income_table.appendChild(new_USC_row)

    //Total Deductions
    let new_total_deductions_row = document.createElement("tr")
    
    let total_deductions_table = document.createElement("th")
    total_deductions_table.innerText = "Total Deductions"

    let yearly_total_deductions_table = document.createElement("td")
    yearly_total_deductions_table.innerText = ((net_tax) + (PRSI * NUMBER_OF_WEEKS) + USC).toFixed(2)

    let monthly_total_deductions_table = document.createElement("td")
    monthly_total_deductions_table.innerText = (((net_tax) / NUMBER_OF_MONTHS) + ((PRSI * NUMBER_OF_WEEKS) / NUMBER_OF_MONTHS) + (USC / NUMBER_OF_MONTHS)).toFixed(2)

    let weekly_total_deductions_table = document.createElement("td")
    weekly_total_deductions_table.innerText = (((net_tax) / NUMBER_OF_WEEKS) + PRSI + (USC / NUMBER_OF_WEEKS)).toFixed(2)

    let daily_total_deductions_table = document.createElement("td")
    daily_total_deductions_table.innerText = (((net_tax) / NUMBER_OF_WORKING_DAYS) + ((PRSI * NUMBER_OF_WEEKS) / NUMBER_OF_WORKING_DAYS) + (USC / NUMBER_OF_WORKING_DAYS)).toFixed(2)

    new_total_deductions_row.appendChild(total_deductions_table)
    new_total_deductions_row.appendChild(yearly_total_deductions_table)
    new_total_deductions_row.appendChild(monthly_total_deductions_table)
    new_total_deductions_row.appendChild(weekly_total_deductions_table)
    new_total_deductions_row.appendChild(daily_total_deductions_table)

    income_table.appendChild(new_total_deductions_row)

    //Take Home
    let new_take_home_row = document.createElement("tr")
    
    let take_home_table = document.createElement("th")
    take_home_table.innerText = "Take Home"

    let yearly_take_home_table = document.createElement("td")
    yearly_take_home_table.innerText = (salary - ((net_tax) + (PRSI * NUMBER_OF_WEEKS) + USC).toFixed(2))

    let monthly_take_home_table = document.createElement("td")
    monthly_take_home_table.innerText = ((salary / NUMBER_OF_MONTHS) - (((net_tax) / NUMBER_OF_MONTHS) + ((PRSI * NUMBER_OF_WEEKS) / NUMBER_OF_MONTHS) + (USC / NUMBER_OF_MONTHS))).toFixed(2)

    let weekly_take_home_table = document.createElement("td")
    weekly_take_home_table.innerText = ((salary / NUMBER_OF_WEEKS) - (((net_tax) / NUMBER_OF_WEEKS) + PRSI + (USC / NUMBER_OF_WEEKS))).toFixed(2)

    let daily_take_home_table = document.createElement("td")
    daily_take_home_table.innerText = ((salary / NUMBER_OF_WORKING_DAYS) - (((net_tax) / NUMBER_OF_WORKING_DAYS) + ((PRSI * NUMBER_OF_WEEKS) / NUMBER_OF_WORKING_DAYS) + (USC / NUMBER_OF_WORKING_DAYS))).toFixed(2)

    new_take_home_row.appendChild(take_home_table)
    new_take_home_row.appendChild(yearly_take_home_table)
    new_take_home_row.appendChild(monthly_take_home_table)
    new_take_home_row.appendChild(weekly_take_home_table)
    new_take_home_row.appendChild(daily_take_home_table)

    income_table.appendChild(new_take_home_row)
}

function clearIncomeTable()
{
    /*
    $("calculate_button").disabled = false
    $("clear_button").disabled = true
    if (income_table.firstChild)
    {
        income_table.removeChild(income_table.firstChild)
        income_table.removeChild(income_table.firstChild)
        income_table.removeChild(income_table.firstChild)
        income_table.removeChild(income_table.firstChild)
        income_table.removeChild(income_table.firstChild)
        income_table.removeChild(income_table.firstChild)
        income_table.removeChild(income_table.firstChild)
        income_table.removeChild(income_table.firstChild)
        income_table.removeChild(income_table.firstChild)
        income_table.removeChild(income_table.firstChild)
    }
    */
    location.reload()
}