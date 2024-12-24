package com.example.demo.services;

import com.example.demo.entities.RequestEntity;
import com.example.demo.entities.UserEntity;
import com.example.demo.repositories.RequestRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Make a request for a loan.
     * @param request
     * @param userId
     * @return the request entity
     */
    public RequestEntity makeRequest(RequestEntity request, Long userId) {
        short status = 1;
        request.setStatus(status);

        // Retrieve the user by their ID from the userRepository
        Optional<UserEntity> user = userRepository.findById(userId);
        if (user.isPresent()) {
            request.setUser_id(userId);
        } else {
            throw new RuntimeException("User not found");
        }
        return requestRepository.save(request);

    }


    /**
     * Evaluate the request based on the user's information.
     * @param userId the user ID
     * @return the request entity
     */
    public RequestEntity evaluateRequest(Long userId) {
        // Retrieve the request by the user ID from the requestRepository
        Optional<RequestEntity> requestOpt = Optional.ofNullable(requestRepository.nativeQueryFindByUserId(userId));
        Optional<UserEntity> userOpt = userRepository.findById(userId);

        if(requestOpt.isPresent() && userOpt.isPresent()) {
            RequestEntity request = requestOpt.get();
            UserEntity user = userOpt.get();
            boolean result = evaluateCRequest(request, user);

            // Set the status of the request to 3 if the result is false
            if (result) {
                request.setStatus((short) 4);
                CostsLoan(userId);
            }
            return requestRepository.save(request);

        } else {
            throw new RuntimeException("Request not found");
        }
    }


    /**
     * Evaluate the request based on the user's information.
     * @param request the request entity
     * @param user the user entity
     * @return true if the request is pre-approved, false otherwise
     */
    public boolean evaluateCRequest( RequestEntity request, UserEntity user) {
        int loanAmount = request.getAmount();
        float mensualInterestRate = (request.getInterestRate()/100 ) / 12.0f / 100.0f;
        int totalPayments = request.getLimitYears() * 12;
        double monthlyPayment = loanAmount * (mensualInterestRate * Math.pow(1 + mensualInterestRate, totalPayments)) / (Math.pow(1 + mensualInterestRate, totalPayments) - 1);

        long income = user.getSalary();
        float paymentIncomeRate = (float) (monthlyPayment / income) * 100.0f;
        if (paymentIncomeRate > 30) {
            request.setStatus((short) 7);
            return false;
        }

        // Check if the user has been in the job for more than 1 year from now
        LocalDate jobStartDate = request.getJobStartDate();
        LocalDate currentDate = LocalDate.now();
        long yearsBetween = ChronoUnit.YEARS.between(jobStartDate, currentDate);
        if (yearsBetween < 1) {
            request.setStatus((short) 7);
            return false;
        }

        //Check debt income rate
        double debtAmount = request.getDebtAmount() + monthlyPayment;
        double debtIncomeRate = (debtAmount / income) * 100.0f;
        if (debtIncomeRate > 50) {
            request.setStatus((short) 7);
            return false;
        }

        //Check user age
        long age = ChronoUnit.YEARS.between(user.getBirthDate(), currentDate);
        long ageEndLoan = age + request.getLimitYears();
        if (ageEndLoan >= 70) {
            request.setStatus((short) 7);
            return false;
        }


        short savingCapacity = CheckSavingCapacity(request);

        //Check saving capacity
        if (savingCapacity < 3) {
            request.setStatus((short) 7);
            request.setSavingCapacityStatus("Insuficiente");
            return false;

        } else if (savingCapacity >= 3 && savingCapacity < 5) {
            request.setStatus((short) 3);
            request.setSavingCapacityStatus("Moderada");
            return false;

        } else {
            request.setSavingCapacityStatus("Solida");
        }
        return true;
    }


    /**
     * Check the saving capacity of the user based on the request information.
     * @param request the request entity
     * @return the saving capacity of the user
     */
    public short CheckSavingCapacity(RequestEntity request){
        short savingCapacity = 0;

        //Count the conditions that are true
        if (request.isMinimumSalary()){
            savingCapacity++;
        }
        if (request.isConsistentSavingHistory()){
            savingCapacity++;
        }
        if (request.isPeriodicDeposit()){
            savingCapacity++;
        }
        if (request.isSalaryYearRelation()){
            savingCapacity++;
        }
        if (request.isNearlyRetirements()) {
            savingCapacity++;
        }

        return savingCapacity;

    }


    /**
     * Update the status of the request.
     * @param requestId the request ID
     * @param status the status of the request
     * @return the request entity
     */
    public RequestEntity updateRequest(Long requestId, short status) {
        Optional<RequestEntity> requestOpt = requestRepository.findById(requestId);
        if(requestOpt.isPresent()) {
            RequestEntity request = requestOpt.get();
            if (status == 4) {
                CostsLoan(request.getUser_id());
            }
            request.setStatus(status);

            return requestRepository.save(request);
        } else {
            throw new RuntimeException("Request not found");
        }
    }


    /**
     * Get the status of the request.
     * @param requestId the request ID
     * @return the status of the request
     */
    public short getRequestStatus(Long requestId) {
        Optional<RequestEntity> requestOpt = requestRepository.findById(requestId);
        if(requestOpt.isPresent()) {
            return requestOpt.get().getStatus();
        } else {
            throw new RuntimeException("Request not found");
        }
    }

    
    /**
     * Get all the requests.
     * @return the list of request entities
     */
    public List<RequestEntity> getAllRequests() {
        return requestRepository.findAll();
    }

    /**
     * Calculate the costs of the loan.
     * @param userId the user ID
     * @return the request entity
     */
    public RequestEntity CostsLoan(Long userId) {
        Optional<RequestEntity> requestOpt = Optional.ofNullable(requestRepository.nativeQueryFindByUserId(userId));
        Optional<UserEntity> userOpt = userRepository.findById(userId);
        if (requestOpt.isPresent() && userOpt.isPresent()) {
            RequestEntity request = requestOpt.get();
            UserEntity user = userOpt.get();

            //Calculate the monthly payment
            int AmountRequest = request.getAmount();
            float mensualInterestRate = (request.getInterestRate() / 100) / 12.0f / 100.0f;
            int totalPayments = request.getLimitYears() * 12;
            double monthlyPayment = AmountRequest * (mensualInterestRate * Math.pow(1 + mensualInterestRate,
                    totalPayments)) / (Math.pow(1 + mensualInterestRate, totalPayments) - 1);
            //set fire insurance
            int fire_insurance = 20000; //20,000 monthly

            //Calculate insurance
            double insurance = AmountRequest * 0.0003;

            //Calculate administrative fee
            double administrativeFee = AmountRequest * 0.01;

            double monthlyCost = monthlyPayment + insurance + fire_insurance;

            double totalCost = monthlyCost * totalPayments + administrativeFee;

            request.setInsurance(insurance);
            request.setAdministrativeFee(administrativeFee);
            request.setFireInsurance(fire_insurance);
            request.setLoanAmount(totalCost);
            //update the request
            return requestRepository.save(request);
        } else {
            throw new RuntimeException("Request not found");
        }
    }

    /**
     * Get the request by the user ID.
     * @param userId the user ID
     * @return the request entity
     */
    public RequestEntity getRequest(Long userId) {
        return requestRepository.nativeQueryFindByUserId(userId);
    }
}
