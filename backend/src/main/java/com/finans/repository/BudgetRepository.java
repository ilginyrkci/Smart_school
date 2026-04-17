package com.finans.repository;

import com.finans.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findTopByUserIdOrderByIdDesc(Long userId);
    Optional<Budget> findTopByOrderByIdDesc();
}
