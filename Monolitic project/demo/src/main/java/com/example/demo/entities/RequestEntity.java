package com.example.demo.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestEntity {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (unique = true, nullable = false)
    private long id;

    // status 1 = initial review, 2 = missing documents, 3 = review, 4 = Pre-approved, 5 = final Aprobation, 6 = Aproved,
    // 7 = Rejected, 8 = Canceled, 9 = disbursement
    private short status;
    private LocalDate jobStartDate;
    private double debtAmount;

    private boolean minimumSalary;
    private boolean consistentSavingHistory;
    private boolean periodicDeposit;
    private boolean salaryYearRelation;
    private boolean nearlyRetirements;

    private String SavingCapacityStatus;
    //Loan related

    // 1: first property, 2: second property, 3: comercial property, 4:remodelation
    private short loanType;
    private float interestRate;
    private LocalDate date;     //When the loan was made
    private short limitYears;
    private int amount;         //loan amount
    private int insurance;
    private int fireInsurance;
    private double loanAmount; //Final amount

    //Foreign Key

    private Long user_id;


}
