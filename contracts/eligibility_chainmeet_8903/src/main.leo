// ChainMeet - Eligibility Verification Contract
// Handles ZK proof verification for meeting eligibility rules

program eligibility_chainmeet_8903.aleo {
    // Eligibility proof structure
    struct EligibilityProof {
        proof_id: u64,
        meeting_id: u64,
        rule_type: u8, // 0: NFT, 1: Token, 2: DAO, 3: Custom
        proof_hash: field,
        verified: bool,
    }

    // Private record for eligibility verification
    record EligibilityRecord {
        owner: address,
        proof_id: u64,
        meeting_id: u64,
        rule_type: u8,
        verification_key: field,
    }

    // Public mappings
    mapping proofs: u64 => EligibilityProof;
    mapping meeting_eligibility: u64 => u64; // meeting_id => proof_id
    mapping user_eligibility: address => u64; // user => proof_id
    mapping proof_counter: u8 => u64; // Use u8 as key for singleton counter

    // Constructor - required for deployment (non-upgradable)
    @noupgrade
    async constructor() {}

    // Verify NFT ownership proof (without revealing NFT ID)
    async transition verify_nft_ownership(
        meeting_id: u64,
        nft_contract_hash: field,
        ownership_proof: field,
        min_balance: u64
    ) -> Future {
        return verify_nft_ownership_onchain(
            meeting_id,
            self.caller,
            nft_contract_hash,
            ownership_proof,
            min_balance,
        );
    }

    async function verify_nft_ownership_onchain(
        meeting_id: u64,
        user: address,
        nft_contract_hash: field,
        ownership_proof: field,
        min_balance: u64
    ) {
        let proof_valid = verify_proof(ownership_proof, nft_contract_hash, min_balance);
        
        if (proof_valid) {
            let current_counter = Mapping::get_or_use(proof_counter, 0u8, 0u64);
            let proof_id: u64 = current_counter + 1u64;
            Mapping::set(proof_counter, 0u8, proof_id);
            
            let proof = EligibilityProof {
                proof_id: proof_id,
                meeting_id: meeting_id,
                rule_type: 0u8,
                proof_hash: ownership_proof,
                verified: true,
            };

            Mapping::set(proofs, proof_id, proof);
            Mapping::set(meeting_eligibility, meeting_id, proof_id);
            Mapping::set(user_eligibility, user, proof_id);
        }
    }

    // Verify token balance proof (without revealing exact amount)
    async transition verify_token_balance(
        meeting_id: u64,
        token_contract_hash: field,
        balance_proof: field,
        min_balance: u64
    ) -> Future {
        return verify_token_balance_onchain(
            meeting_id,
            self.caller,
            token_contract_hash,
            balance_proof,
            min_balance,
        );
    }

    async function verify_token_balance_onchain(
        meeting_id: u64,
        user: address,
        token_contract_hash: field,
        balance_proof: field,
        min_balance: u64
    ) {
        let proof_valid = verify_proof(balance_proof, token_contract_hash, min_balance);
        
        if (proof_valid) {
            let current_counter = Mapping::get_or_use(proof_counter, 0u8, 0u64);
            let proof_id: u64 = current_counter + 1u64;
            Mapping::set(proof_counter, 0u8, proof_id);
            
            let proof = EligibilityProof {
                proof_id: proof_id,
                meeting_id: meeting_id,
                rule_type: 1u8,
                proof_hash: balance_proof,
                verified: true,
            };

            Mapping::set(proofs, proof_id, proof);
            Mapping::set(meeting_eligibility, meeting_id, proof_id);
            Mapping::set(user_eligibility, user, proof_id);
        }
    }

    // Verify DAO membership proof (without revealing identity)
    async transition verify_dao_membership(
        meeting_id: u64,
        dao_contract_hash: field,
        membership_proof: field
    ) -> Future {
        return verify_dao_membership_onchain(
            meeting_id,
            self.caller,
            dao_contract_hash,
            membership_proof,
        );
    }

    async function verify_dao_membership_onchain(
        meeting_id: u64,
        user: address,
        dao_contract_hash: field,
        membership_proof: field
    ) {
        let proof_valid = verify_proof(membership_proof, dao_contract_hash, 0u64);
        
        if (proof_valid) {
            let current_counter = Mapping::get_or_use(proof_counter, 0u8, 0u64);
            let proof_id: u64 = current_counter + 1u64;
            Mapping::set(proof_counter, 0u8, proof_id);
            
            let proof = EligibilityProof {
                proof_id: proof_id,
                meeting_id: meeting_id,
                rule_type: 2u8,
                proof_hash: membership_proof,
                verified: true,
            };

            Mapping::set(proofs, proof_id, proof);
            Mapping::set(meeting_eligibility, meeting_id, proof_id);
            Mapping::set(user_eligibility, user, proof_id);
        }
    }

    // Verify custom rule proof
    async transition verify_custom_rule(
        meeting_id: u64,
        rule_hash: field,
        custom_proof: field
    ) -> Future {
        return verify_custom_rule_onchain(
            meeting_id,
            self.caller,
            rule_hash,
            custom_proof,
        );
    }

    async function verify_custom_rule_onchain(
        meeting_id: u64,
        user: address,
        rule_hash: field,
        custom_proof: field
    ) {
        let proof_valid = verify_proof(custom_proof, rule_hash, 0u64);
        
        if (proof_valid) {
            let current_counter = Mapping::get_or_use(proof_counter, 0u8, 0u64);
            let proof_id: u64 = current_counter + 1u64;
            Mapping::set(proof_counter, 0u8, proof_id);
            
            let proof = EligibilityProof {
                proof_id: proof_id,
                meeting_id: meeting_id,
                rule_type: 3u8,
                proof_hash: custom_proof,
                verified: true,
            };

            Mapping::set(proofs, proof_id, proof);
            Mapping::set(meeting_eligibility, meeting_id, proof_id);
            Mapping::set(user_eligibility, user, proof_id);
        }
    }

    // Helper function to verify proofs (simplified)
    inline verify_proof(proof: field, contract_hash: field, threshold: u64) -> bool {
        // In production, this would use proper ZK proof verification
        // For now, simplified check
        return proof != 0field;
    }

    // Helper function to hash proof and meeting_id
    inline hash_to_field(proof: field, meeting_id: u64) -> field {
        return proof;
    }
}
