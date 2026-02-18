//package com.nttdata.account.infra.api;
//
//import com.nttdata.account.domain.dto.AccountReportDTO;
//import com.nttdata.account.domain.service.ReportService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//import reactor.core.publisher.Flux;
//
//@RestController
//@RequestMapping("/reports")
//@RequiredArgsConstructor
//public class ReportController {
//    private final ReportService service;
//
//    @GetMapping("/{clientId}")
//    public Flux<AccountReportDTO> getReport(
//            @PathVariable Long clientId,
//            @RequestParam String startDate,
//            @RequestParam String endDate) {
//        return service.generateReport(clientId, startDate, endDate);
//    }
//}
